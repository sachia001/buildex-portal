import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';

const RESOURCE_LABELS = {
    inspection:        '📋 ინსპექტირება',
    user:              '👤 პერსონალი',
    procedure:         '📂 პროცედურა',
    equipment:         '🛠️ ხელსაწყო',
    complaint:         '📨 საჩივარი',
    corrective_action: '⚙️ CAR',
    internal_audit:    '🔍 შიდა აუდიტი',
};

const ACTION_COLORS = {
    'შექმნა':    'success',
    'განახლება': 'primary',
    'წაშლა':     'danger',
    'ატვირთვა':  'info',
};

const RESOURCE_COLORS = {
    inspection:        'dark',
    user:              'secondary',
    procedure:         'warning',
    equipment:         'info',
    complaint:         'danger',
    corrective_action: 'warning',
    internal_audit:    'primary',
};

function formatGeoDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d)) return '—';
    return d.toLocaleString('ka-GE', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
    });
}

const AuditLogPage = ({ role }) => {
    const [logs, setLogs]           = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');
    const [filterResource, setFilterResource] = useState('');
    const [filterUser, setFilterUser]         = useState('');
    const [search, setSearch]       = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (filterResource) params.resource = filterResource;
            if (filterUser)     params.user     = filterUser;
            const res = await axios.get('/api/audit-logs', { params });
            setLogs(res.data);
        } catch (e) {
            setError(e.response?.data?.error || 'ჩატვირთვის შეცდომა');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!['admin', 'quality_manager'].includes(role)) {
        return (
            <div className="text-center mt-5">
                <h4 className="text-danger">🚫 წვდომა აკრძალულია</h4>
                <p className="text-muted">აუდიტის ჟურნალი მხოლოდ ადმინს და ხარ. მენეჯერს ხელმისაწვდომია.</p>
            </div>
        );
    }

    const displayed = logs.filter(log => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
            (log.username || '').toLowerCase().includes(s) ||
            (log.resourceName || '').toLowerCase().includes(s) ||
            (log.action || '').toLowerCase().includes(s) ||
            (log.details || '').toLowerCase().includes(s)
        );
    });

    return (
        <div>
            {/* Page header */}
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm"
                 style={{ borderLeft: '4px solid var(--primary)' }}>
                <div>
                    <h4 className="page-title mb-0">🔍 აუდიტის ჟურნალი</h4>
                    <div className="page-subtitle">ყველა მოქმედების სრული ჩანაწერი — ISO/IEC 17020:2012 §8.4</div>
                </div>
                <Button variant="outline-secondary" size="sm" onClick={fetchLogs} disabled={loading}>
                    🔄 განახლება
                </Button>
            </div>

            {/* Filters */}
            <Card className="mb-3">
                <Card.Body className="py-3">
                    <Row className="g-2 align-items-end">
                        <Col md={3}>
                            <Form.Label className="mb-1 small fw-semibold text-muted">რესურსის ტიპი</Form.Label>
                            <Form.Select size="sm" value={filterResource} onChange={e => setFilterResource(e.target.value)}>
                                <option value="">ყველა ტიპი</option>
                                {Object.entries(RESOURCE_LABELS).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Label className="mb-1 small fw-semibold text-muted">მომხმარებელი</Form.Label>
                            <Form.Control
                                size="sm"
                                placeholder="მომხმარებლის სახელი..."
                                value={filterUser}
                                onChange={e => setFilterUser(e.target.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="mb-1 small fw-semibold text-muted">ძიება</Form.Label>
                            <Form.Control
                                size="sm"
                                placeholder="სახელი, მოქმედება, დეტალი..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Button variant="primary" size="sm" onClick={fetchLogs} className="w-100">
                                🔍 გაფილტვრა
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Results count */}
            {!loading && !error && (
                <div className="mb-2 small text-muted px-1">
                    ნაჩვენებია <strong>{displayed.length}</strong> ჩანაწერი {logs.length !== displayed.length ? `(სულ: ${logs.length})` : ''}
                </div>
            )}

            {/* Table */}
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <span>📋 მოქმედებების ჟურნალი (ბოლო 500)</span>
                    <Badge bg="light" text="dark">{displayed.length} ჩანაწ.</Badge>
                </Card.Header>

                {loading && (
                    <Card.Body className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <div className="mt-2 text-muted small">იტვირთება...</div>
                    </Card.Body>
                )}

                {error && (
                    <Card.Body>
                        <div className="alert alert-danger mb-0">{error}</div>
                    </Card.Body>
                )}

                {!loading && !error && (
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: '155px' }}>თარიღი / დრო</th>
                                    <th style={{ width: '100px' }}>მოქმედება</th>
                                    <th style={{ width: '130px' }}>რესურსი</th>
                                    <th>სახელი / ID</th>
                                    <th style={{ width: '110px' }}>მომხმარებელი</th>
                                    <th style={{ width: '120px' }}>როლი</th>
                                    <th>დეტალი</th>
                                    <th style={{ width: '110px' }}>IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center text-muted py-4">
                                            ჩანაწერები ვერ მოიძებნა
                                        </td>
                                    </tr>
                                )}
                                {displayed.map(log => (
                                    <tr key={log._id}>
                                        <td>
                                            <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                {formatGeoDate(log.timestamp)}
                                            </span>
                                        </td>
                                        <td>
                                            <Badge bg={ACTION_COLORS[log.action] || 'secondary'} className="px-2 py-1">
                                                {log.action}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge bg={RESOURCE_COLORS[log.resource] || 'secondary'} className="px-2 py-1" style={{ fontSize: '0.72rem' }}>
                                                {RESOURCE_LABELS[log.resource] || log.resource}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{log.resourceName || '—'}</div>
                                            {log.resourceId && (
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                    {log.resourceId.slice(-8)}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{log.username || '—'}</span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                {log.role || '—'}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                                {log.details || '—'}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                {log.ip || '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AuditLogPage;
