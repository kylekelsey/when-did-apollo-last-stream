CREATE TABLE IF NOT EXISTS last_stream (
	stream_id int4 DEFAULT 0 NULL,
	laststream timestamp NULL,
	islive bool DEFAULT false NULL
);

INSERT INTO last_stream (stream_id,laststream,islive) VALUES
	 (0,'2024-05-18 10:00:00',false);
