
-- Create a demo event if it does not already exist
INSERT INTO events (name, start_at)
SELECT 'SlotLock Demo Event', NOW() + INTERVAL '7 days'
WHERE NOT EXISTS (
    SELECT 1
    FROM events
    WHERE name = 'SlotLock Demo Event'
);

-- Create 10 seats for the demo event
INSERT INTO seats (event_id, seat_no)
SELECT e.id, s.seat_no
FROM events e
CROSS JOIN (
    VALUES
        ('A1'), ('A2'), ('A3'), ('A4'), ('A5'),
        ('B1'), ('B2'), ('B3'), ('B4'), ('B5')
) AS s(seat_no)
WHERE e.name = 'SlotLock Demo Event'
ON CONFLICT (event_id, seat_no) DO NOTHING;
