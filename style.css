@import url('https://fonts.googleapis.com/css2?family=Emilys+Candy&family=Nunito:wght@400;600;700;800&display=swap');

:root {
    --bg-color: #edece4; 
    --card-color: #f5cece; 
    --text-color: #965b4c; 
    --white: #ffffff;
    --btn-color: #965b4c;
    --success: #25d366;
    --danger: #d9534f;
    --edit: #5bc0de;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: 'Nunito', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.5;
    padding-bottom: 200px;
}

/* CONTAINER BASE */
.container, .admin-container { 
    width: 100%; 
    max-width: 480px; 
    margin: 0 auto; 
    padding: 20px; 
}

header { text-align: center; margin-bottom: 30px; display: flex; flex-direction: column; align-items: center; }
h1 { font-family: 'Emilys Candy', cursive; font-size: 3rem; font-weight: 900; }
.subtitle { font-size: 1rem; letter-spacing: 3px; text-transform: uppercase; font-weight: 800; }

/* ADMIN CARDS E FORMULÁRIOS */
.admin-card { 
    background-color: var(--card-color) !important; 
    border-radius: 25px !important; 
    padding: 25px !important; 
    margin-bottom: 25px !important; 
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.form-group { margin-bottom: 15px; text-align: left; }
.form-group label { display: block; font-weight: 800; margin-bottom: 5px; font-size: 0.9rem; }
.form-group input, .form-group select, .form-group textarea { 
    width: 100% !important; padding: 12px !important; border-radius: 12px !important; 
    border: none !important; background: #fff !important; font-family: 'Nunito' !important; font-weight: 700;
}

/* BOTÕES GERAIS */
.admin-btn { 
    background-color: var(--text-color); color: #fff; border: none; padding: 14px; 
    border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; margin-top: 10px; 
}
.admin-btn.danger { background-color: var(--danger) !important; }
.admin-btn.success { background-color: var(--success) !important; }

/* LISTAGEM NO ADMIN (LINHAS) */
.item-list-row { 
    display: flex !important; 
    justify-content: space-between !important; 
    align-items: center !important; 
    background: rgba(255,255,255,0.4) !important; 
    padding: 12px 15px !important; 
    border-radius: 15px !important; 
    margin-bottom: 10px !important; 
}

.item-actions { display: flex; gap: 8px; }

/* BOTÕES PEQUENOS (EDITAR/X) */
.btn-tool { 
    padding: 8px 12px !important; border: none !important; border-radius: 8px !important; 
    font-weight: 800 !important; font-size: 0.8rem !important; cursor: pointer !important; 
    color: #fff !important; width: auto !important; margin: 0 !important;
}
.btn-edit { background-color: var(--edit) !important; }
.btn-del { background-color: var(--danger) !important; }

/* MODAL (FIX DE VERDADE) */
.modal-overlay { 
    position: fixed !important; 
    top: 0 !important; left: 0 !important; 
    width: 100vw !important; height: 100vh !important; 
    background: rgba(0, 0, 0, 0.8) !important; 
    display: none; justify-content: center; align-items: center; 
    z-index: 10000 !important; 
}
.modal-overlay.open { display: flex !important; }

.modal-content { 
    width: 90% !important; 
    max-width: 400px !important; /* Trava a largura aqui */
    margin-bottom: 0 !important;
    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

/* RESPONSIVIDADE PC */
@media (min-width: 768px) {
    .container { max-width: 1200px; }
    .admin-container { max-width: 800px; } /* Admin maior no PC */
    .info-cards-wrapper { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
}
