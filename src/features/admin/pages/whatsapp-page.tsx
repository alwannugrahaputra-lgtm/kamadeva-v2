// Penjelasan file: halaman admin WhatsApp Center dengan list chat kiri dan isi chat kanan.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

type Conversation = {
  key: string;
  name: string;
  subtitle: string;
  chatId: string;
  clientId: string | null;
  leadId: string | null;
  messages: {
    id: string;
    direction: string;
    preview: string;
    syncedAt: Date;
  }[];
};

export default async function WhatsAppPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; chat?: string }>;
}) {
  await requireRole(ADMIN_ROUTE_ACCESS.whatsapp);
  const params = await searchParams;
  const query = params.q?.trim().toLowerCase();

  const syncLogs = await prisma.whatsAppSync.findMany({
    orderBy: { syncedAt: "asc" },
    include: { client: true, lead: true },
  });

  const conversationMap = new Map<string, Conversation>();

  for (const log of syncLogs) {
    const chatKey = log.externalChatId || log.clientId || log.leadId || log.id;
    const name = log.client?.fullName ?? log.lead?.name ?? "Chat tanpa nama";
    const subtitle = log.client ? "Client aktif" : log.lead ? "Calon klien" : "Umum";

    const existing = conversationMap.get(chatKey) ?? {
      key: chatKey,
      name,
      subtitle,
      chatId: log.externalChatId || chatKey,
      clientId: log.clientId,
      leadId: log.leadId,
      messages: [],
    };

    existing.messages.push({
      id: log.id,
      direction: log.direction,
      preview: log.preview,
      syncedAt: log.syncedAt,
    });

    conversationMap.set(chatKey, existing);
  }

  const conversations = Array.from(conversationMap.values()).filter((item) =>
    query ? item.name.toLowerCase().includes(query) : true,
  );
  const selectedKey = params.chat ?? conversations[0]?.key;
  const selectedConversation = conversations.find((item) => item.key === selectedKey) ?? conversations[0];

  async function sendMessage(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ROUTE_ACCESS.whatsapp);

    const chat = String(formData.get("chat") ?? "");
    const preview = String(formData.get("preview") ?? "").trim();
    const clientId = String(formData.get("clientId") ?? "") || null;
    const leadId = String(formData.get("leadId") ?? "") || null;

    if (!preview) {
      redirect(`/admin/whatsapp?chat=${chat}`);
    }

    await prisma.whatsAppSync.create({
      data: {
        externalChatId: chat,
        preview,
        direction: "OUTBOUND",
        clientId,
        leadId,
      },
    });

    revalidatePath("/admin/whatsapp");
    redirect(`/admin/whatsapp?chat=${chat}`);
  }

  return (
    <div>
      <AdminTopbar
        title="WhatsApp"
        description="WhatsApp Center untuk melihat histori chat dan membalas pesan."
      />
      <div className="admin-list-panel">
        <div className="admin-whatsapp-shell">
          <aside className="admin-whatsapp-list">
            <div className="admin-whatsapp-search">
              <form action="/admin/whatsapp">
                <input name="q" defaultValue={params.q ?? ""} placeholder="Cari chat..." className="input-base" />
              </form>
            </div>
            <div className="admin-whatsapp-conversations">
              {conversations.map((item) => (
                <a
                  key={item.key}
                  href={`/admin/whatsapp?chat=${item.key}`}
                  className={`admin-whatsapp-thread ${item.key === selectedConversation?.key ? "is-active" : ""}`}
                >
                  <div className="admin-whatsapp-avatar">{item.name.slice(0, 1)}</div>
                  <div>
                    <p className="font-semibold text-[var(--brand-deep)]">{item.name}</p>
                    <p className="text-sm text-[var(--muted)]">{item.messages[item.messages.length - 1]?.preview ?? item.subtitle}</p>
                  </div>
                </a>
              ))}
            </div>
          </aside>

          <section className="admin-whatsapp-detail">
            <div className="admin-whatsapp-header">
              <div>
                <p className="font-semibold text-[var(--brand-deep)]">{selectedConversation?.name ?? "WhatsApp Center"}</p>
                <p className="text-sm text-[var(--muted)]">{selectedConversation?.subtitle ?? "Pilih percakapan untuk melihat isi chat."}</p>
              </div>
            </div>

            <div className="admin-whatsapp-messages">
              {selectedConversation?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`admin-whatsapp-bubble ${message.direction === "OUTBOUND" ? "is-outbound" : "is-inbound"}`}
                >
                  <p>{message.preview}</p>
                  <span>
                    {new Date(message.syncedAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )) ?? (
                <p className="text-sm text-[var(--muted)]">Belum ada percakapan.</p>
              )}
            </div>

            {selectedConversation ? (
              <form action={sendMessage} className="admin-whatsapp-input">
                <input type="hidden" name="chat" value={selectedConversation.chatId} />
                <input type="hidden" name="clientId" value={selectedConversation.clientId ?? ""} />
                <input type="hidden" name="leadId" value={selectedConversation.leadId ?? ""} />
                <input name="preview" placeholder="Ketik pesan..." className="input-base" />
                <button type="submit" className="admin-primary-icon-button">
                  ➜
                </button>
              </form>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
