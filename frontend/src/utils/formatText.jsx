export function formatBold(text) {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
}