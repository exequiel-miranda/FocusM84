// Harsh anti-procrastination messages
const harshMessages = [
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
]

// Quit messages based on progress
const quitMessages = [
    {
        threshold: 0,
        messages: [
            "¿Ya te rindes? Apenas empezaste.",
            "Esto es exactamente por qué no avanzas.",
            "Rendirse es fácil. Por eso todos lo hacen.",
        ]
    },
    {
        threshold: 0.5,
        messages: [
            "Estás a la mitad. Rendirte ahora es desperdiciar todo.",
            "50% completado y quieres tirar todo por la borda.",
            "Has invertido tiempo. No lo desperdicies ahora.",
        ]
    },
    {
        threshold: 0.9,
        messages: [
            "90% COMPLETADO. ¿EN SERIO VAS A RENDIRTE?",
            "FALTAN MINUTOS. NO SEAS ESTÚPIDO.",
            "Estás a NADA de terminar. CONTINÚA.",
        ]
    }
]

// Success and failure messages
const successMessages = [
    "¡LO LOGRASTE! Esto es lo que se siente el progreso real.",
    "Tarea completada. Así se hace.",
    "Excelente. Sigue así y llegarás lejos.",
]

const failureMessages = [
    "Abandonaste. Otra oportunidad desperdiciada.",
    "Te rendiste. Esto es por qué no avanzas.",
    "Fallaste. Pero puedes intentarlo de nuevo.",
]

const focusMessages = [
    "Concéntrate. Cada segundo cuenta.",
    "No te distraigas. Mantén el enfoque.",
    "Estás trabajando. Sigue así.",
]

export function getHarshMessage() {
    return harshMessages[Math.floor(Math.random() * harshMessages.length)]
}

export function getQuitMessage(progress) {
    let messageSet = quitMessages[0]
    for (let i = quitMessages.length - 1; i >= 0; i--) {
        if (progress >= quitMessages[i].threshold) {
            messageSet = quitMessages[i]
            break
        }
    }
    const messages = messageSet.messages
    return messages[Math.floor(Math.random() * messages.length)]
}

export function getSuccessMessage() {
    return successMessages[Math.floor(Math.random() * successMessages.length)]
}

export function getFailureMessage() {
    return failureMessages[Math.floor(Math.random() * failureMessages.length)]
}

export function getFocusMessage() {
    return focusMessages[Math.floor(Math.random() * focusMessages.length)]
}

export function getPerformanceMessage(stats) {
    const rate = stats.completionRate

    if (rate === 0) {
        return "No has completado ninguna tarea. Es hora de cambiar eso."
    } else if (rate < 30) {
        return `${rate}% de tasa de éxito. Inaceptable. Mejora.`
    } else if (rate < 50) {
        return `${rate}% de tasa de éxito. Puedes hacerlo mejor.`
    } else if (rate < 70) {
        return `${rate}% de tasa de éxito. Vas mejorando.`
    } else if (rate < 90) {
        return `${rate}% de tasa de éxito. Buen trabajo. Sigue así.`
    } else {
        return `${rate}% de tasa de éxito. Excelente disciplina.`
    }
}

export function getTimeMessage(minutesRemaining) {
    if (minutesRemaining > 30) {
        return "Tienes tiempo. Usa cada minuto sabiamente."
    } else if (minutesRemaining > 15) {
        return "El tiempo avanza. Mantén el enfoque."
    } else if (minutesRemaining > 5) {
        return "Quedan pocos minutos. No aflojes ahora."
    } else {
        return "ÚLTIMOS MINUTOS. Da todo lo que tienes."
    }
}

const pauseMessages = [
    "La competencia no está pausando ahora mismo.",
    "El cronómetro es tu único juez, y no le gusta esperar.",
    "Cada segundo de pausa es un segundo que le regalas a la mediocridad.",
    "¿Pausa 'necesaria'? Solo si tu casa se está quemando.",
    "Vuelve al trabajo. El descanso se gana, no se pide.",
    "Tu cerebro está buscando una excusa. No se la des.",
    "Incluso un segundo de pausa rompe el flujo que tanto te costó conseguir."
]

export function getPauseMessage() {
    return pauseMessages[Math.floor(Math.random() * pauseMessages.length)]
}
