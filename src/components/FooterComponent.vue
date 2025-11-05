<script setup>
</script>
<template>
    <div class="footer">
        <div class="footer-element">
            <label class="footer-title"> Come ci trovi</label>
            <div class="footer-list">
                <div class="footer-row">
                    <img src="../icons/clock.svg" alt="Orario" />
                    <label class="footer-text">14:00-19:00 | Lunedì-Sabato</label>
                </div>
                <a href="https://maps.app.goo.gl/2vtuVn9tbHBYb1tY8" class="footer-row">
                    <img src="../icons/location.svg" alt="Posizione" />
                    <label class="footer-text">Via Cadorna 55 Buscate VA</label>
                </a>
            </div>
        </div>
        <div class="footer-element">
            <label class="footer-title">Contatti</label>
            <div class="footer-list">
                <a href="tel:+393421263387" class="footer-row">
                    <img src="../icons/phone.svg" alt="Telefono" />
                    <label class="footer-text">+39 342 126 3387</label>
                </a>

                <a class="footer-row" href="mailto:kilowatts.industries@gmail.com ">
                    <img src="../icons/mail.svg" alt="Mail" />
                    <label class="footer-text"> kilowatts.industries@gmail.com </label>
                </a>

            </div>
        </div>
    </div>
</template>
<style scoped>
.footer {
    margin-top: 30px;
    border-top: 1px solid var(--color-container-border);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 30px 20px;
    background-color: var(--color-bg);
    width: 100%;
}

.footer-element {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.footer-title {
    font-size: 24px;
    color: var(--color-primary-light);
}

.footer-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.footer-row {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--color-text);
    text-decoration: none;
}

.footer-row img,
.footer-row label {
    cursor: pointer;
}

.footer-row img,
.footer-row label:hover {
    text-decoration: underline;
}
</style>
