--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-06-06 16:33:32

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 16559)
-- Name: data; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA data;


ALTER SCHEMA data OWNER TO postgres;

--
-- TOC entry 2 (class 3079 OID 16560)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16600)
-- Name: achieved_levels; Type: TABLE; Schema: data; Owner: postgres
--

CREATE TABLE data.achieved_levels (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    level_id uuid NOT NULL,
    score smallint NOT NULL,
    level_setup json
);


ALTER TABLE data.achieved_levels OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16616)
-- Name: categories; Type: TABLE; Schema: data; Owner: postgres
--

CREATE TABLE data.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    title character varying(255),
    category_order bigint
);


ALTER TABLE data.categories OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16583)
-- Name: levels; Type: TABLE; Schema: data; Owner: postgres
--

CREATE TABLE data.levels (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    owner_id uuid,
    level_number bigint NOT NULL,
    task text NOT NULL,
    category_id uuid,
    public boolean DEFAULT false NOT NULL,
    level_name character varying(255),
    setup jsonb,
    person_image character varying(255) DEFAULT 'person1.png'::character varying NOT NULL,
    automat_image character varying(255) DEFAULT 'automat1.png'::character varying
);


ALTER TABLE data.levels OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24794)
-- Name: score; Type: TABLE; Schema: data; Owner: postgres
--

CREATE TABLE data.score (
    user_id uuid NOT NULL,
    user_score bigint DEFAULT 0 NOT NULL
);


ALTER TABLE data.score OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16571)
-- Name: users; Type: TABLE; Schema: data; Owner: postgres
--

CREATE TABLE data.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(255) NOT NULL,
    mail character varying(255) NOT NULL,
    user_password text NOT NULL,
    user_role character varying(50) DEFAULT 'user'::character varying,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE data.users OWNER TO postgres;

--
-- TOC entry 4950 (class 0 OID 16600)
-- Dependencies: 221
-- Data for Name: achieved_levels; Type: TABLE DATA; Schema: data; Owner: postgres
--

COPY data.achieved_levels (id, user_id, level_id, score, level_setup) FROM stdin;
\.


--
-- TOC entry 4951 (class 0 OID 16616)
-- Dependencies: 222
-- Data for Name: categories; Type: TABLE DATA; Schema: data; Owner: postgres
--

COPY data.categories (id, created_at, title, category_order) FROM stdin;
29f4f57c-ce80-493d-9406-40f6817aec25	2025-05-12 22:56:39.689764+02	💧 Water Dispensers	0
7bdce76c-1972-4a71-b027-053cb2198ae4	2025-05-12 22:56:39.689764+02	🍬 Gumballs	1
5d97db1b-8fd2-4a71-91a5-7f82d10c90ad	2025-05-12 22:56:39.689764+02	🥤 Soft Drinks	2
a17447b0-0e3e-4a50-9a13-d3c304579b56	2025-05-12 22:56:39.689764+02	💐 Flowers	5
f8a9ac2f-4b03-41cc-8858-92b531ab58b7	2025-05-12 22:56:39.689764+02	🅿️ Parking tickets	6
2ef6e3c7-fd13-4c7a-aee4-daeef4d74c44	2025-05-12 22:56:39.689764+02	🥗 Healthy food	4
95d6ff45-3978-48f3-8ab4-2b0a0a6f632c	2025-05-12 22:56:39.689764+02	🥨 Snacks	3
\.


--
-- TOC entry 4949 (class 0 OID 16583)
-- Dependencies: 220
-- Data for Name: levels; Type: TABLE DATA; Schema: data; Owner: postgres
--

COPY data.levels (id, created_at, owner_id, level_number, task, category_id, public, level_name, setup, person_image, automat_image) FROM stdin;
f14f66e3-f73c-439d-8d91-f811ad2cffff	2025-05-19 13:57:08.639428	\N	4	To get a for **60 cent**, I must insert 10c, 20c, 10c in this exact order somewhere in the input, but no **50 cent**!	95d6ff45-3978-48f3-8ab4-2b0a0a6f632c	f	🥨 Level 4	{"type": "NFA", "sequences": [[0.1, 0.2, 0.1]], "accept_all": false, "alphabet_count": {"0.1": 3, "0.2": 2, "0.5": 1}, "accepted_values": [0.6], "forbidden_values": [], "max_input_length": 9, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": false}	person16.png	automat1.png
baf61836-56ba-4730-b8a8-b3bfb265682e	2025-05-19 13:57:08.639428	\N	1	We have new automat at school for gumballs. I can only use **50 cent**, because it takes only one coin per gumball.	7bdce76c-1972-4a71-b027-053cb2198ae4	f	🍬 Level 1	{"type": "NFA", "sequences": [[0.5]], "accept_all": false, "alphabet_count": {"0.1": 10, "0.2": 4, "0.5": 3}, "accepted_values": [0.5], "forbidden_values": [0.1, 0.2], "max_input_length": 1, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": false}	person5.png	automat3.png
f5e564f8-a9dc-427b-b200-9107e5682009	2025-05-19 13:57:08.639428	\N	1	I’m selecting a luxury bouquet for **2.40€**, but I want the machine to reject all **20 cents** and **40 cents** coins and accept only patterns with alternating **30c** and **50c** pieces. All combinations need to be accepted.	a17447b0-0e3e-4a50-9a13-d3c304579b56	f	💐 Level 1	{"type": "NFA", "sequences": [[0.3, 0.5, 0.3, 0.5, 0.3, 0.5], [0.5, 0.3, 0.5, 0.3, 0.5, 0.3]], "accept_all": false, "alphabet_count": {"0.2": 8, "0.3": 6, "0.4": 3, "0.5": 4}, "accepted_values": [2.40], "forbidden_values": [0.4, 0.2], "max_input_length": null, "transition_values": [0.2, 0.3, 0.4, 0.5], "accept_all_sequences": true}	person23.png	automat4.png
47404319-194c-490e-ba3b-636770c3c9d5	2025-05-19 13:57:08.639428	\N	3	I want to buy protein bar for **60 cent**, but only by inserting **20 cent** coins in a row. No **10 cent** coins allowed!	95d6ff45-3978-48f3-8ab4-2b0a0a6f632c	f	🥨 Level 3	{"type": "NFA", "sequences": [[0.2, 0.2, 0.2]], "accept_all": false, "alphabet_count": {"0.1": 4, "0.2": 3, "0.5": 1}, "accepted_values": [0.6], "forbidden_values": [0.1], "max_input_length": 8, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": false}	person15.png	automat1.png
f41f6163-0c7f-453c-a516-7d40dea2dbc6	2025-05-19 13:57:08.639428	\N	5	I’m buying a chips for **1.20 €**, but I only want to use **20c** and **50c** coins.	95d6ff45-3978-48f3-8ab4-2b0a0a6f632c	f	🥨 Level 5	{"type": "NFA", "sequences": [[0.5, 0.5, 0.2], [0.5, 0.2, 0.5], [0.2, 0.5, 0.5]], "accept_all": false, "alphabet_count": {"0.1": 5, "0.2": 5, "0.5": 3}, "accepted_values": [1.2], "forbidden_values": [0.1], "max_input_length": 3, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": true}	person17.png	automat1.png
fd7dbafc-4db8-4a8a-9117-7cef6335ceb9	2025-05-19 13:57:08.639428	\N	4	I’m on a strict routine: I want to switch 10 and 20 cent coins repeatedly until I reach exactly **1€**, but no **50 cent**!	2ef6e3c7-fd13-4c7a-aee4-daeef4d74c44	f	🥗 Level 4	{"type": "NFA", "sequences": [[0.1, 0.2, 0.1, 0.2, 0.1, 0.2, 0.1], [0.2, 0.1, 0.2, 0.1, 0.2, 0.1, 0.2]], "accept_all": false, "alphabet_count": {"0.1": 5, "0.2": 5, "0.5": 3}, "accepted_values": [1], "forbidden_values": [0.5], "max_input_length": 7, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": false}	person21.png	automat14.png
5df463b5-442b-45a7-91a7-4b1ae58b42e6	2025-05-19 13:57:08.639428	\N	2	I want to buy a parking ticket for **1 €**. The machine should always know what to do — no matter which coin I insert or which state it is in. That means you need to create an automat where: Each state has a defined transition for every coin. The automat accepts if the total inserted coins add up to exactly **1€**. If someone inserts a wrong sequence, the machine should reject it.	f8a9ac2f-4b03-41cc-8858-92b531ab58b7	f	🅿️ Level 2	{"type": "DFA", "sequences": [[1], [0.2, 0.2, 0.2, 0.2, 0.2]], "accept_all": false, "alphabet_count": {"0.2": 5, "1.0": 3}, "accepted_values": [1], "forbidden_values": [], "transition_values": [0.2, 1.0], "accept_all_sequences": true}	person27.png	automat15.png
a97e98af-bf89-4fb2-a5ef-a22827cd2554	2025-05-19 13:57:08.639428	\N	2	I’m getting both a sandwich and a drink. One costs **30 cent**, the other **50 cent**. Make sure the machine can accept both of them.	5d97db1b-8fd2-4a71-91a5-7f82d10c90ad	f	🥤 Level 2	{"type": "NFA", "sequences": [], "accept_all": true, "alphabet_count": {"0.1": 3, "0.2": 1, "0.5": 1}, "accepted_values": [0.3, 0.5], "forbidden_values": [], "max_input_length": null, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": false}	person10.png	automat2.png
441c088a-0fb5-4ea9-b5e9-027791bbed12	2025-05-19 13:57:08.639428	\N	2	Water now costs **20 cent**. I have a few 10 and **20 cent** coins, can you fix the machine to accept **20 cent** total?	29f4f57c-ce80-493d-9406-40f6817aec25	f	💧 Level 2	{"type": "NFA", "sequences": [], "accept_all": false, "alphabet_count": {"0.1": 2, "0.2": 2}, "accepted_values": [0.2], "forbidden_values": [], "max_input_length": null, "transition_values": [0.1, 0.2], "accept_all_sequences": false}	person2.png	automat9.png
71959b4e-4b80-4d74-b25d-097945e59007	2025-05-19 13:57:08.639428	\N	3	The water price is now **30 cent**. I only have 10 and **20 cent** coins. Please make sure the machine accepts any valid combination.	29f4f57c-ce80-493d-9406-40f6817aec25	f	💧 Level 3	{"type": "NFA", "sequences": [], "accept_all": false, "alphabet_count": {"0.1": 2, "0.2": 2}, "accepted_values": [0.3], "forbidden_values": [], "max_input_length": null, "transition_values": [0.1, 0.2], "accept_all_sequences": false}	person3.png	automat9.png
e76bde7c-973d-483f-9eaf-f628d3bf1773	2025-05-19 13:57:08.639428	\N	4	I want to buy water for **40 cent**, but I want to use only **20 cent** coins this time.	29f4f57c-ce80-493d-9406-40f6817aec25	f	💧 Level 4	{"type": "NFA", "sequences": [], "accept_all": false, "alphabet_count": {"0.2": 2}, "accepted_values": [0.4], "forbidden_values": [], "max_input_length": null, "transition_values": [0.1, 0.2], "accept_all_sequences": false}	person4.png	automat9.png
b7bd44a7-0c32-4604-a5e2-727623ceda29	2025-05-19 13:57:08.639428	\N	1	I want to buy a healthy combo that costs **1.30€**, but I insist on inserting coins from the smallest to the largest.	2ef6e3c7-fd13-4c7a-aee4-daeef4d74c44	f	🥗 Level 1	{"type": "NFA", "sequences": [[0.1, 0.2, 0.5, 0.5], [0.1, 0.1, 0.1, 0.5, 0.5], [0.1, 0.1, 0.1, 0.1, 0.2, 0.2, 0.5], [0.1, 0.1, 0.2, 0.2, 0.2, 0.5]], "accept_all": false, "alphabet_count": {"0.1": 4, "0.2": 3, "0.5": 2}, "accepted_values": [1.3], "forbidden_values": [], "max_input_length": null, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": false}	person18.png	automat14.png
2038575b-7346-4ecf-a9f8-24b3b01297f5	2025-05-19 13:57:08.639428	\N	3	I’m in a rush – I want to pay **1.40 €**, but I don’t want to use **50 cent** coins at the end.	2ef6e3c7-fd13-4c7a-aee4-daeef4d74c44	f	🥗 Level 3	{"type": "NFA", "sequences": [[0.5, 0.5, 0.2, 0.2], [0.2, 1, 0.2], [1, 0.2, 0.2], [0.2, 0.2, 1], [0.2, 0.5, 0.5, 0.2], [0.5, 0.2, 0.5, 0.2]], "accept_all": false, "alphabet_count": {"1": 2, "0.2": 3, "0.5": 2}, "accepted_values": [1.4], "forbidden_values": [], "max_input_length": "", "transition_values": [0.2, 0.5, 1], "accept_all_sequences": false}	person19.png	automat14.png
3faa3b7f-9221-4210-8505-c13351364195	2025-05-19 13:57:08.639428	\N	2	The automat now takes **max 2 coins** per gumball and it costs **30 cent**.	7bdce76c-1972-4a71-b027-053cb2198ae4	f	🍬 Level 2	{"type": "NFA", "sequences": [[0.1, 0.2], [0.2, 0.1]], "accept_all": false, "alphabet_count": {"0.1": 3, "0.2": 2}, "accepted_values": [0.3], "forbidden_values": [], "max_input_length": 2, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": false}	person6.png	automat3.png
975519f3-aeb7-4dea-a4df-25884853e8c3	2025-05-19 13:57:08.639428	\N	1	I want to buy coffee for **10 cent** and soda for **20 cent**. The automat needs to accept both.	5d97db1b-8fd2-4a71-91a5-7f82d10c90ad	f	🥤 Level 1	{"type": "NFA", "sequences": [], "accept_all": true, "alphabet_count": {"0.1": 4, "0.2": 2}, "accepted_values": [0.1, 0.2], "forbidden_values": [], "max_input_length": null, "transition_values": [0.1, 0.2], "accept_all_sequences": false}	person9.png	automat2.png
8fe059ee-3dd0-4208-93b8-aa2e02114c42	2025-05-19 13:57:08.639428	\N	3	A would like to buy a gumball for 50 cents, but I have no 50 cent coins. Can you help me to reach exactly **50 cents** with the available coins?	7bdce76c-1972-4a71-b027-053cb2198ae4	f	🍬 Level 3	{"type": "NFA", "sequences": [], "accept_all": false, "alphabet_count": {"1": 2, "0.1": 1, "0.2": 2}, "accepted_values": [0.5], "forbidden_values": [0.5], "max_input_length": null, "transition_values": [0.1, 0.2, 0.5, 1.0], "accept_all_sequences": false}	person7.png	automat3.png
94565f61-6029-4bbc-8ce3-ad2df6d5a8e3	2025-05-19 13:57:08.639428	\N	2	Can you use the available coins to reach exactly **40 cents**? Make all possible combinations.	2ef6e3c7-fd13-4c7a-aee4-daeef4d74c44	f	🥗 Level 2	{"type": "NFA", "sequences": [[0.2, 0.1, 0.1], [0.1, 0.2, 0.1], [0.1, 0.1, 0.2]], "accept_all": false, "alphabet_count": {"0.1": 2, "0.2": 1}, "accepted_values": [0.4], "forbidden_values": [], "max_input_length": 3, "transition_values": [0.1, 0.2], "accept_all_sequences": true}	person20.png	automat14.png
e1bc8f2b-adee-48a8-a8fc-dc21cfc1cfad	2025-05-19 13:57:08.639428	\N	1	I'd like to get some water for **10 cent**. Please make the machine work with just one **10 cent** coin.	29f4f57c-ce80-493d-9406-40f6817aec25	f	💧 Level 1	{"type": "NFA", "sequences": [], "accept_all": false, "alphabet_count": {"0.1": 1}, "accepted_values": [0.1], "forbidden_values": [], "max_input_length": "", "transition_values": [0.1, 0.2], "accept_all_sequences": false}	person1.png	automat9.png
c79c378e-9ad0-486a-8b32-8c914ef1f6c0	2025-05-19 13:57:08.639428	\N	1	Create an automat that accepts either one **1 €** coin or two 50c coins to get a ticket.	f8a9ac2f-4b03-41cc-8858-92b531ab58b7	f	🅿️ Level 1	{"type": "DFA", "sequences": [], "accept_all": false, "alphabet_count": {"0.5": 5, "1.0": 3}, "accepted_values": [1.0], "forbidden_values": [], "max_input_length": 2, "transition_values": [0.5, 1.0], "accept_all_sequences": false}	person28.png	automat15.png
ed8aef3c-4aa9-4e04-8434-97944e237e63	2025-05-19 13:57:08.639428	\N	3	I'm craving juice for **40 cent** and chips for **50 cent**. Can the machine handle either?	5d97db1b-8fd2-4a71-91a5-7f82d10c90ad	f	🥤 Level 3	{"type": "NFA", "sequences": [], "accept_all": true, "alphabet_count": {"0.1": 3, "0.2": 1, "0.5": 2}, "accepted_values": [0.4, 0.5], "forbidden_values": [], "max_input_length": null, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": false}	person11.png	automat2.png
befa969e-8716-4aff-a8aa-0d94bcde41b3	2025-05-19 13:57:08.639428	\N	4	I want a snack for **30 cent** and a wrap for **60 cent**. Make sure the machine works for both.	5d97db1b-8fd2-4a71-91a5-7f82d10c90ad	f	🥤 Level 4	{"type": "NFA", "sequences": [], "accept_all": true, "alphabet_count": {"0.1": 4, "0.2": 2, "0.5": 1}, "accepted_values": [0.3, 0.6], "forbidden_values": [], "max_input_length": null, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": false}	person12.png	automat2.png
63a6328a-1138-47a0-bd4c-dce88081646f	2025-05-19 13:57:08.639428	\N	4	This new gumball machine is fun! I want a gumball for **1€**, and I have a mix of coins. I can mix the coins to get **1€** in total.	7bdce76c-1972-4a71-b027-053cb2198ae4	f	🍬 Level 4	{"type": "NFA", "sequences": [], "accept_all": false, "alphabet_count": {"0.1": 2, "0.2": 4, "0.5": 1}, "accepted_values": [1], "forbidden_values": [], "max_input_length": 6, "transition_values": [0.1, 0.2, 0.5, 1.0], "accept_all_sequences": false}	person8.png	automat3.png
a9f3567a-1019-4da5-8611-87bf9a772597	2025-05-19 13:57:08.639428	\N	2	I want to buy a rose set for **1.70€**. I always like to start and end paying with the largest coin. Also, I don't use **10 cent** coins.	a17447b0-0e3e-4a50-9a13-d3c304579b56	f	💐 Level 2	{"type": "NFA", "sequences": [[0.5, 0.2, 0.2, 0.3, 0.5], [0.5, 0.2, 0.3, 0.2, 0.5], [0.5, 0.3, 0.2, 0.2, 0.5]], "accept_all": false, "alphabet_count": {"0.2": 3, "0.3": 2, "0.5": 2}, "accepted_values": [1.7], "forbidden_values": [0.1], "max_input_length": null, "transition_values": [0.2, 0.3, 0.5], "accept_all_sequences": false}	person24.png	automat4.png
a4a1a640-ca03-4ea1-9209-0ab2684f76a7	2025-05-19 13:57:08.639428	\N	3	The gift costs **1€**, but I only want to use **50 cent** coins or **20 cent** coins. Try to make that work!	a17447b0-0e3e-4a50-9a13-d3c304579b56	f	💐 Level 3	{"type": "NFA", "sequences": [[0.5, 0.5], [0.2, 0.2, 0.2, 0.2, 0.2]], "accept_all": false, "alphabet_count": {"1": 4, "0.1": 4, "0.2": 10, "0.5": 6}, "accepted_values": [1], "forbidden_values": [0.1, 1], "transition_values": [0.1, 0.2, 0.5, 1], "accept_all_sequences": true}	person25.png	automat4.png
2331a5d3-b010-4114-a55b-3d77b832ed3e	2025-05-19 13:57:08.639428	\N	1	I want to buy a pack of skittles for **70 cent**, but make sure the machine doesn't allow **20 cent** coins!	95d6ff45-3978-48f3-8ab4-2b0a0a6f632c	f	🥨 Level 1	{"type": "NFA", "sequences": [], "accept_all": false, "alphabet_count": {"0.1": 3, "0.2": 2, "0.5": 2}, "accepted_values": [0.7], "forbidden_values": [0.2], "max_input_length": 6, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": false}	person13.png	automat1.png
09390cf8-e68e-4d3e-903a-a997c2226d23	2025-05-19 13:57:08.639428	\N	2	I need a pringels for **50 cent**, but don’t allow **50 cent** coins – I lost trust in them.	95d6ff45-3978-48f3-8ab4-2b0a0a6f632c	f	🥨 Level 2	{"type": "NFA", "sequences": [], "accept_all": false, "alphabet_count": {"0.1": 5, "0.2": 2, "0.5": 1}, "accepted_values": [0.5], "forbidden_values": [0.5], "max_input_length": 7, "transition_values": [0.1, 0.2, 0.5], "accept_all_sequences": false}	person14.png	automat1.png
a94edfb4-0ac5-412f-aae0-4fb39bc982e4	2025-05-19 13:57:08.639428	\N	3	The ticket costs **1.60 €**. Accept 1€ and 20c  — but nothing more!	f8a9ac2f-4b03-41cc-8858-92b531ab58b7	f	🅿️ Level 3	{"type": "DFA", "sequences": [[1, 0.2, 0.2, 0.2], [0.2, 1, 0.2, 0.2], [0.2, 0.2, 1, 0.2], [0.2, 0.2, 0.2, 1]], "accept_all": false, "alphabet_count": {"1": 2, "0.1": 3, "0.2": 4, "0.5": 1}, "accepted_values": [1.6], "forbidden_values": [0.5, 0.1], "max_input_length": 6, "transition_values": [0.2, 0.5, 1, 0.1], "accept_all_sequences": true}	person29.png	automat15.png
d6fa139c-bb4b-4897-9e88-55352dbee052	2025-05-19 13:57:08.639428	\N	4	This machine wants **1 €** for an **hour** of parking. I will be staying here **2 hours**. Make all paths available for my wallet to pay for the parking. Also I want to pay as quick as possible, so I want to insert 3 coins at most.	f8a9ac2f-4b03-41cc-8858-92b531ab58b7	f	🅿️ Level 4	{"type": "DFA", "sequences": [[0.5, 0.5, 1], [0.5, 1, 0.5], [1, 0.5, 0.5], [2]], "accept_all": false, "alphabet_count": {"1": 2, "2": 2, "0.1": 2, "0.2": 1, "0.5": 2}, "accepted_values": [2], "forbidden_values": [], "max_input_length": 3, "transition_values": [0.1, 0.2, 0.5, 1, 2], "accept_all_sequences": true}	person30.png	automat15.png
\.


--
-- TOC entry 4952 (class 0 OID 24794)
-- Dependencies: 223
-- Data for Name: score; Type: TABLE DATA; Schema: data; Owner: postgres
--

COPY data.score (user_id, user_score) FROM stdin;
\.


--
-- TOC entry 4948 (class 0 OID 16571)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: data; Owner: postgres
--

COPY data.users (id, username, mail, user_password, user_role, created_at) FROM stdin;
\.


--
-- TOC entry 4791 (class 2606 OID 16605)
-- Name: achieved_levels achieved_levels_pkey; Type: CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.achieved_levels
    ADD CONSTRAINT achieved_levels_pkey PRIMARY KEY (id);


--
-- TOC entry 4795 (class 2606 OID 16622)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4789 (class 2606 OID 16591)
-- Name: levels levels_pkey; Type: CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (id);


--
-- TOC entry 4797 (class 2606 OID 24823)
-- Name: score score_pkey; Type: CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.score
    ADD CONSTRAINT score_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4793 (class 2606 OID 24814)
-- Name: achieved_levels unique_user_level; Type: CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.achieved_levels
    ADD CONSTRAINT unique_user_level UNIQUE (user_id, level_id);


--
-- TOC entry 4783 (class 2606 OID 16582)
-- Name: users users_mail_key; Type: CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.users
    ADD CONSTRAINT users_mail_key UNIQUE (mail);


--
-- TOC entry 4785 (class 2606 OID 16578)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 16580)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4800 (class 2606 OID 16611)
-- Name: achieved_levels achieved_levels_level_id_fkey; Type: FK CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.achieved_levels
    ADD CONSTRAINT achieved_levels_level_id_fkey FOREIGN KEY (level_id) REFERENCES data.levels(id) ON DELETE CASCADE;


--
-- TOC entry 4801 (class 2606 OID 16606)
-- Name: achieved_levels achieved_levels_user_id_fkey; Type: FK CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.achieved_levels
    ADD CONSTRAINT achieved_levels_user_id_fkey FOREIGN KEY (user_id) REFERENCES data.users(id) ON DELETE CASCADE;


--
-- TOC entry 4798 (class 2606 OID 16628)
-- Name: levels categories_user_id_fkey; Type: FK CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.levels
    ADD CONSTRAINT categories_user_id_fkey FOREIGN KEY (category_id) REFERENCES data.categories(id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4799 (class 2606 OID 16592)
-- Name: levels levels_user_id_fkey; Type: FK CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.levels
    ADD CONSTRAINT levels_user_id_fkey FOREIGN KEY (owner_id) REFERENCES data.users(id) ON DELETE CASCADE;


--
-- TOC entry 4802 (class 2606 OID 24801)
-- Name: score score_user_id_fkey; Type: FK CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY data.score
    ADD CONSTRAINT score_user_id_fkey FOREIGN KEY (user_id) REFERENCES data.users(id) ON DELETE CASCADE;


--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA data; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA data TO fini_user;


--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE achieved_levels; Type: ACL; Schema: data; Owner: postgres
--

GRANT SELECT ON TABLE data.achieved_levels TO fini_user;


--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE categories; Type: ACL; Schema: data; Owner: postgres
--

GRANT SELECT ON TABLE data.categories TO fini_user;


--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE levels; Type: ACL; Schema: data; Owner: postgres
--

GRANT SELECT ON TABLE data.levels TO fini_user;


--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE score; Type: ACL; Schema: data; Owner: postgres
--

GRANT SELECT ON TABLE data.score TO fini_user;


--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE users; Type: ACL; Schema: data; Owner: postgres
--

GRANT SELECT ON TABLE data.users TO fini_user;


--
-- TOC entry 2071 (class 826 OID 16638)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: data; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA data GRANT SELECT ON TABLES TO fini_user;


-- Completed on 2025-06-06 16:33:33

--
-- PostgreSQL database dump complete
--

