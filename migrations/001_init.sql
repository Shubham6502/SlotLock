
CREATE TABLE IF NOT EXISTS events(
id BIGSERIAL PRIMARY KEY,
name TEXT NOT NULL,
start_at TIMESTAMPTZ NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seats(
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id),
    seat_no TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN('available', 'held', 'booked')),
    hold_expire_at TIMESTAMPTZ,

    UNIQUE (event_id,seat_no),
    CHECK(
        (status='held' AND hold_expire_at is NOT NULL)
        OR
        (status<>'held' AND hold_expire_at is NULL)
    )
);

CREATE TABLE IF NOT EXISTS holds(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    seat_id BIGINT NOT NULL REFERENCES seats(id),
    user_id TEXT NOT NULL,
    expire_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN('active', 'expired', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS bookings(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    seat_id BIGINT NOT NULL REFERENCES seats(id),
    user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK( status IN('confirmed','cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS one_confirmed_booking_seat ON bookings(seat_id) 
WHERE status ='confirmed';

CREATE INDEX IF NOT EXISTS holds_expiry_idx ON holds(expire_at) WHERE status='active';