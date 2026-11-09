'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LogOut, Mail, Phone, Trash2, X, Clock, CheckCircle2, Archive, Inbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  audience: string;
  message: string;
  status: string;
  created_at: string;
};

const statusOptions = [
  { value: 'new', label: 'New', icon: Inbox },
  { value: 'reviewed', label: 'Reviewed', icon: CheckCircle2 },
  { value: 'archived', label: 'Archived', icon: Archive },
];

function StatusBadge({ status }: { status: string }) {
  const cls = status === 'new' ? 'status-new' : status === 'reviewed' ? 'status-reviewed' : 'status-archived';
  const label = statusOptions.find((s) => s.value === status)?.label ?? status;
  return <span className={`status-badge ${cls}`}>{label}</span>;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updating, setUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!supabase) { setLoading(false); return; }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
        router.replace('/admin/login');
        return;
      }
      setAuthChecked(true);
      await fetchInquiries();
      setLoading(false);
    };
    init();

 let subscription: { unsubscribe: () => void } | null = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        (async () => {
          if (!session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
            router.replace('/admin/login');
          }
        })();
      });
      subscription = data.subscription;
    }

    return () => { subscription?.unsubscribe(); };
  }, [router]);

  const fetchInquiries = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('qpr_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setInquiries(data as Inquiry[]);
    }
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  const handleStatusChange = async (inquiry: Inquiry, newStatus: string) => {
    if (!supabase) return;
    setUpdating(true);
    const { error } = await supabase
      .from('qpr_inquiries')
      .update({ status: newStatus })
      .eq('id', inquiry.id);
    if (!error) {
      setInquiries((prev) => prev.map((i) => i.id === inquiry.id ? { ...i, status: newStatus } : i));
      setSelected((prev) => prev && prev.id === inquiry.id ? { ...prev, status: newStatus } : prev);
    }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!supabase || !deleteTarget) return;
    setUpdating(true);
    const { error } = await supabase
      .from('qpr_inquiries')
      .delete()
      .eq('id', deleteTarget.id);
    if (!error) {
      setInquiries((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
    }
    setDeleteTarget(null);
    setConfirmDelete(false);
    setUpdating(false);
  };

  const filtered = statusFilter === 'all' ? inquiries : inquiries.filter((i) => i.status === statusFilter);
  const newCount = inquiries.filter((i) => i.status === 'new').length;

  if (loading || !authChecked) {
    return (
      <main className="admin-shell">
        <div className="admin-loading">
          <div className="admin-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <div className="admin-brand">
            <img src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/QPR/QPR%20LogoAsset%201.svg" alt="Quick's Priority Resources" />
            <span className="admin-badge">Admin</span>
          </div>
          <button className="admin-signout" onClick={handleSignOut}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>

      <div className="container admin-body">
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon admin-stat-new"><Inbox size={22} /></div>
            <div><strong>{newCount}</strong><span>New inquiries</span></div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon admin-stat-total"><Mail size={22} /></div>
            <div><strong>{inquiries.length}</strong><span>Total submissions</span></div>
          </div>
        </div>

        <div className="admin-toolbar">
          <h2>Inquiry Submissions</h2>
          <div className="admin-filters">
            <button className={statusFilter === 'all' ? 'admin-filter active' : 'admin-filter'} onClick={() => setStatusFilter('all')}>All</button>
            <button className={statusFilter === 'new' ? 'admin-filter active' : 'admin-filter'} onClick={() => setStatusFilter('new')}>New</button>
            <button className={statusFilter === 'reviewed' ? 'admin-filter active' : 'admin-filter'} onClick={() => setStatusFilter('reviewed')}>Reviewed</button>
            <button className={statusFilter === 'archived' ? 'admin-filter active' : 'admin-filter'} onClick={() => setStatusFilter('archived')}>Archived</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <Inbox size={40} />
            <p>No inquiries to display.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Audience</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inquiry) => (
                  <tr key={inquiry.id} onClick={() => setSelected(inquiry)} className="admin-table-row">
                    <td><strong>{inquiry.name}</strong></td>
                    <td>{inquiry.email}</td>
                    <td>{inquiry.phone || '—'}</td>
                    <td>{inquiry.audience}</td>
                    <td><div className="admin-date">{formatDate(inquiry.created_at)}</div><div className="admin-time">{formatTime(inquiry.created_at)}</div></td>
                    <td><StatusBadge status={inquiry.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="admin-drawer-overlay" onClick={() => setSelected(null)}>
          <div className="admin-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <div>
                <h2>{selected.name}</h2>
                <StatusBadge status={selected.status} />
              </div>
              <button className="admin-drawer-close" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>

            <div className="admin-drawer-body">
              <div className="admin-detail-group">
                <label><Mail size={14} /> Email</label>
                <a href={`mailto:${selected.email}`}>{selected.email}</a>
              </div>
              {selected.phone && (
                <div className="admin-detail-group">
                  <label><Phone size={14} /> Phone</label>
                  <a href={`tel:${selected.phone}`}>{selected.phone}</a>
                </div>
              )}
              <div className="admin-detail-group">
                <label><Clock size={14} /> Submitted</label>
                <span>{formatDate(selected.created_at)} at {formatTime(selected.created_at)}</span>
              </div>
              <div className="admin-detail-group">
                <label>Audience</label>
                <span>{selected.audience}</span>
              </div>
              <div className="admin-detail-group admin-detail-message">
                <label>Message</label>
                <p>{selected.message}</p>
              </div>
            </div>

            <div className="admin-drawer-footer">
              <div className="admin-status-actions">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={selected.status === opt.value ? 'admin-status-btn active' : 'admin-status-btn'}
                    disabled={updating}
                    onClick={() => handleStatusChange(selected, opt.value)}
                  >
                    <opt.icon size={15} /> {opt.label}
                  </button>
                ))}
              </div>
              <button className="admin-delete-btn" disabled={updating} onClick={() => { setDeleteTarget(selected); setConfirmDelete(true); }}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => { setConfirmDelete(false); setDeleteTarget(null); }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-icon"><Trash2 size={28} /></div>
            <h3>Delete this inquiry?</h3>
            <p>This will permanently remove the submission from <strong>{deleteTarget.name}</strong>. This cannot be undone.</p>
            <div className="admin-modal-actions">
              <button className="admin-modal-cancel" onClick={() => { setConfirmDelete(false); setDeleteTarget(null); }}>Cancel</button>
              <button className="admin-modal-confirm" disabled={updating} onClick={handleDelete}>Delete inquiry <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
