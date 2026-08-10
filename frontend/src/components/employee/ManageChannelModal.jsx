import { useEffect, useState } from "react";
import { X, Hash, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { messagesApi } from "@/lib/api/messages";
import { employeeProfileApi } from "@/lib/api/employeeProfile";

// Shared by MessagesPage.jsx's "New Channel" button (channel = null, create
// mode) and its per-channel "Manage" action (channel set, membership mode).
export default function ManageChannelModal({ channel, onClose, onChanged }) {
  const isCreateMode = !channel;
  const [name, setName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [memberIds, setMemberIds] = useState(channel?.memberIds || []);
  const [addingId, setAddingId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    employeeProfileApi.getAll().then(setAllEmployees).catch(() => {});
  }, []);

  const memberSet = new Set(memberIds);
  const nonMembers = allEmployees.filter((e) => !memberSet.has(e.id));
  const members = allEmployees.filter((e) => memberSet.has(e.id));

  async function handleCreate() {
    if (!name.trim()) {
      setError("Channel name is required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await messagesApi.createChannel(name.trim(), memberIds, isDefault);
      onChanged();
    } catch (err) {
      setError(err.message || "Couldn't create this channel.");
      setSaving(false);
    }
  }

  async function handleAddMember(employeeId) {
    if (!employeeId) return;
    setError("");
    try {
      await messagesApi.addChannelMember(channel.id, employeeId);
      setMemberIds((prev) => [...prev, employeeId]);
      setAddingId("");
    } catch (err) {
      setError(err.message || "Couldn't add that employee.");
    }
  }

  async function handleRemoveMember(employeeId) {
    setError("");
    try {
      await messagesApi.removeChannelMember(channel.id, employeeId);
      setMemberIds((prev) => prev.filter((id) => id !== employeeId));
    } catch (err) {
      setError(err.message || "Couldn't remove that employee.");
    }
  }

  function handleAddClick() {
    if (!addingId) return;
    if (isCreateMode) {
      setMemberIds((prev) => [...prev, addingId]);
      setAddingId("");
    } else {
      handleAddMember(addingId);
    }
  }

  function handleRemoveClick(employeeId) {
    if (isCreateMode) {
      setMemberIds((prev) => prev.filter((id) => id !== employeeId));
    } else {
      handleRemoveMember(employeeId);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
              <Hash className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isCreateMode ? "New channel" : `Manage #${channel.name}`}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isCreateMode && (
          <div className="mb-4 flex flex-col gap-3">
            <div>
              <Label htmlFor="channel-name">Channel name</Label>
              <Input id="channel-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marketing" />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded" />
              Default channel — every new employee joins automatically
            </label>
          </div>
        )}

        <div className="mb-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Members {!isCreateMode && `(${members.length})`}
          </p>
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1">
            {members.length === 0 && <p className="text-sm text-slate-400 dark:text-slate-500">No members yet.</p>}
            {members.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800">
                <span className="text-sm text-slate-700 dark:text-slate-200">{e.name}</span>
                <button
                  onClick={() => handleRemoveClick(e.id)}
                  className="text-slate-400 hover:text-red-500"
                  title="Remove from channel"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-2 flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="add-member">Add employee</Label>
            <select
              id="add-member"
              value={addingId}
              onChange={(e) => setAddingId(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="">Select an employee…</option>
              {nonMembers.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="button" variant="outline" onClick={handleAddClick} disabled={!addingId}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex gap-2">
          {isCreateMode ? (
            <Button type="button" onClick={handleCreate} disabled={saving} className="flex-1">
              {saving ? "Creating…" : "Create channel"}
            </Button>
          ) : (
            <Button type="button" onClick={onChanged} className="flex-1">
              Done
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
