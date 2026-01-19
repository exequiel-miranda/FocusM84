// ==========================================
// Motivation Engine - Harsh messaging system
// ==========================================

const Motivation = {
    // Harsh anti-procrastination messages
    harshMessages: [
        "Cada minuto que pierdes es un minuto que nunca recuperarás.",
        "Mientras procrastinas, otros están logrando sus metas.",
        "No hay excusas. Solo resultados o justificaciones.",
        "El tiempo no espera a los indecisos.",
        "Tus sueños no se cumplirán solos. TRABAJA.",
        "La procrastinación es el cementerio de las oportunidades.",
        "Deja de pensar. Empieza a HACER.",
        "No eres especial. Tienes que trabajar como todos.",
        "El éxito no llega a los que esperan.",
        "Hoy es el día. No mañana. HOY.",
        "Tus excusas no pagan las cuentas.",
        "O trabajas ahora o te arrepientes después.",
        "La disciplina es hacer lo que odias como si lo amaras.",
        "No hay atajos. Solo trabajo duro.",
        "Tus competidores están trabajando mientras tú descansas.",
        "El dolor de la disciplina o el dolor del arrepentimiento. Tú eliges.",
        "Nadie va a hacer tu trabajo por ti.",
        "Cada tarea que evitas es una deuda con tu futuro.",
        "La comodidad es el enemigo del progreso.",
        "Deja de ser débil. Haz el trabajo."
    ],

    // Quit attempt messages (progressively harsher)
    quitMessages: [
        {
            threshold: 0,
            messages: [
                "¿Ya te rindes? Apenas empezaste.",
                "Esto es exactamente por qué no avanzas.",
                "Rendirse es fácil. Por eso todos lo hacen.",
                "¿Cuántas veces más vas a abandonar?",
                "Tu futuro yo está decepcionado de ti."
            ]
        },
        {
            threshold: 0.25,
            messages: [
                "Has completado 25% y quieres rendirte. Patético.",
                "La mayoría abandona aquí. ¿Serás como la mayoría?",
                "25% no es suficiente. Nunca lo será.",
                "Esto es por qué sigues en el mismo lugar.",
                "Termina lo que empezaste por una vez en tu vida."
            ]
        },
        {
            threshold: 0.50,
            messages: [
                "Estás a la mitad. Rendirte ahora es desperdiciar todo.",
                "50% completado y quieres tirar todo por la borda.",
                "Has invertido tiempo. No lo desperdicies ahora.",
                "La línea entre el éxito y el fracaso está aquí.",
                "Los ganadores terminan. Los perdedores abandonan a mitad de camino."
            ]
        },
        {
            threshold: 0.75,
            messages: [
                "75% completado. Estás TAN CERCA.",
                "Falta tan poco. ¿De verdad vas a rendirte AHORA?",
                "Has llegado tan lejos. No lo arruines.",
                "El último 25% es donde se forjan los campeones.",
                "Termina. Estás a minutos de lograrlo."
            ]
        },
        {
            threshold: 0.90,
            messages: [
                "90% COMPLETADO. ¿EN SERIO VAS A RENDIRTE?",
                "FALTAN MINUTOS. NO SEAS ESTÚPIDO.",
                "Estás a NADA de terminar. CONTINÚA.",
                "Has hecho 90% del trabajo. TERMÍNALO.",
                "NO. TERMINA LO QUE EMPEZASTE."
            ]
        }
    ],

    // Success messages
    successMessages: [
        "¡LO LOGRASTE! Esto es lo que se siente el progreso real.",
        "Tarea completada. Así se hace.",
        "Excelente. Sigue así y llegarás lejos.",
        "Una tarea menos. Sigue trabajando.",
        "Bien hecho. Ahora a la siguiente.",
        "Esto es disciplina en acción.",
        "Completado. Tu futuro yo te lo agradece.",
        "Así se construye el éxito. Tarea por tarea.",
        "¡Perfecto! No te detengas ahora.",
        "Completado. Eres más fuerte de lo que pensabas."
    ],

    // Failure messages
    failureMessages: [
        "Abandonaste. Otra oportunidad desperdiciada.",
        "Te rendiste. Esto es por qué no avanzas.",
        "Fallaste. Pero puedes intentarlo de nuevo.",
        "Abandonar es un hábito. Rómpelo.",
        "Te rendiste. ¿Cuántas veces más?",
        "Otra tarea sin completar. Otra excusa.",
        "Fallaste. Pero todavía puedes cambiar.",
        "Abandonaste. El éxito requiere más que esto.",
        "Te rendiste cuando se puso difícil. Como siempre.",
        "Fallaste. Pero los ganadores se levantan."
    ],

    // Focus mode messages (during work)
    focusMessages: [
        "Concéntrate. Cada segundo cuenta.",
        "No te distraigas. Mantén el enfoque.",
        "Estás trabajando. Sigue así.",
        "El trabajo duro paga. Continúa.",
        "Enfocado. Así se logran las cosas.",
        "No pares. Estás en la zona.",
        "Concentración total. Excelente.",
        "Sigue trabajando. No te detengas.",
        "Esto es disciplina. Continúa.",
        "Enfocado en el objetivo. Perfecto."
    ],

    // Get random harsh message
    getHarshMessage() {
        return this.harshMessages[Math.floor(Math.random() * this.harshMessages.length)];
    },

    // Get quit message based on progress
    getQuitMessage(progress) {
        // Find appropriate threshold
        let messageSet = this.quitMessages[0];
        for (let i = this.quitMessages.length - 1; i >= 0; i--) {
            if (progress >= this.quitMessages[i].threshold) {
                messageSet = this.quitMessages[i];
                break;
            }
        }

        const messages = messageSet.messages;
        return messages[Math.floor(Math.random() * messages.length)];
    },

    // Get success message
    getSuccessMessage() {
        return this.successMessages[Math.floor(Math.random() * this.successMessages.length)];
    },

    // Get failure message
    getFailureMessage() {
        return this.failureMessages[Math.floor(Math.random() * this.failureMessages.length)];
    },

    // Get focus message
    getFocusMessage() {
        return this.focusMessages[Math.floor(Math.random() * this.focusMessages.length)];
    },

    // Get message based on completion rate
    getPerformanceMessage(stats) {
        const rate = stats.completionRate;

        if (rate === 0) {
            return "No has completado ninguna tarea. Es hora de cambiar eso.";
        } else if (rate < 30) {
            return `${rate}% de tasa de éxito. Inaceptable. Mejora.`;
        } else if (rate < 50) {
            return `${rate}% de tasa de éxito. Puedes hacerlo mejor.`;
        } else if (rate < 70) {
            return `${rate}% de tasa de éxito. Vas mejorando.`;
        } else if (rate < 90) {
            return `${rate}% de tasa de éxito. Buen trabajo. Sigue así.`;
        } else {
            return `${rate}% de tasa de éxito. Excelente disciplina.`;
        }
    },

    // Get time-based message
    getTimeMessage(minutesRemaining) {
        if (minutesRemaining > 30) {
            return "Tienes tiempo. Usa cada minuto sabiamente.";
        } else if (minutesRemaining > 15) {
            return "El tiempo avanza. Mantén el enfoque.";
        } else if (minutesRemaining > 5) {
            return "Quedan pocos minutos. No aflojes ahora.";
        } else {
            return "ÚLTIMOS MINUTOS. Da todo lo que tienes.";
        }
    }
};
