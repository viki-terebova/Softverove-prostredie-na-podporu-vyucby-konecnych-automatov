# Bachelor work  
Software support for teaching finite automata

# 🎓 FiniAutoma

FiniAutoma is an interactive **educational web application** designed to help students learn about **finite automata** through **visualization and hands-on exercises**.  
It consists of:
- **Backend:** Flask (Python) with PostgreSQL  
- **Frontend:** React (JavaScript)  
- **Database:** PostgreSQL  

---

## **Getting Started**

### **1. Prerequisites**  
Before running the app, ensure you have the following installed:
- **Python 3.10+** ([Download](https://www.python.org/downloads/))  
- **PostgreSQL** ([Download](https://www.postgresql.org/download/))  
- **Node.js & npm** ([Download](https://nodejs.org/))  
- **Git** ([Download](https://git-scm.com/))  

---

### **2. Clone the Repository**
```sh
git clone https://github.com/viki-terebova/Bakalarska-praca.git
cd Bakalarska-praca
```

---

### **3. Environment Setup**

#### 🛠 `.env` file

Create a `.env` file in the root directory with:

```env
# Database
DB_PASSWORD=your_postgres_password
REINSTALL_DEPENDENCIES=false

# Session (used by Flask for secure cookies, etc.)
SECRET_KEY=some_random_secure_key
```

> ℹ️ `DB_PASSWORD` will be injected into `config.yml` via `${DB_PASSWORD}`.

#### ⚙️ `config.yml` overview

Ensure you have the following structure in `config.yml` (already included in your project):

```yaml
app:
  flask_env: "development"
  flask_app: "app"
  rebuild_app: true
  debug: true

database:
  type: "postgresql"
  host: "localhost"
  port: 5432
  user: "postgres"
  password: ${DB_PASSWORD}
  db_name: "finiautoma_dev"
  schema: "data"

default:
  user_id: 0
  user_name: "Default"
```
---

### **4. Database Setup (with backup)**

If you want to use the pre-prepared database with sample data and level definitions, follow these steps.

#### 🐘 PostgreSQL: Create the database

Open your terminal and access PostgreSQL:
```bash
psql -U postgres
```

In the PostgreSQL shell, run:
```sql
CREATE DATABASE finiautoma_dev;
\q
```

#### 📦 Restore database from dump

In your terminal (outside of `psql`), run:
```bash
psql -U postgres -d finiautoma_dev -f backend/database/finiautoma_dump.sql
```

> ℹ️ If your PostgreSQL user has a different name, change `-U postgres` accordingly.

#### ⚠️ Common issues

- If you get `permission denied` for `backend/database/finiautoma_dump.sql`, run:
  ```bash
  chmod +r backend/database/finiautoma_dump.sql
  ```
- Ensure your `.env` contains the correct `DB_PASSWORD` to match your local PostgreSQL setup.

---

### **5. Install Python Dependencies**
```sh
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

### **6. Run the App Locally**
To run both frontend and backend locally in one step:
```sh
./run_app_locally.sh
```

This script:
- Builds the frontend (`npm run build`)
- Serves it using Flask
- Starts the Flask backend on [http://localhost:5000](http://localhost:5000)

---

## 🔍 How It Works

- Users complete **levels** by building finite automatons that meet specified **conditions**.
- The **editor** allows dragging and connecting states, adding transitions, and testing solutions.
- Levels are grouped into **categories** with progression and scoring.
- Supports both **DFA** and **NFA** types.

---

## 🧪 Testing Automat
After building your automat in the editor, press **Test**.  
The backend will evaluate it based on:
- Wallet and available coins
- Accepted/rejected values or patterns
- Automat structure and determinism (if DFA)
- Whether accepted paths lead to Accept or Reject

---

## 🧑‍💻 Author
**Viktória Terebová**  
Bachelor thesis – Faculty of Mathematics, Physics and Informatics, Comenius University in Bratislava