const formatDateToYMD = (date: Date): string => {
    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const day: string = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;  
}

export const formatChatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
        date.toDateString() ===
        new Date(now.setDate(now.getDate() - 1)).toDateString();

    if (isToday) {
        // If the timestamp is from today, show only the time
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (isYesterday) {
        // If the timestamp is from yesterday, show 'Yesterday' and the time
        return `Yesterday, ${date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    } else {
        // Otherwise, show the date and time
        return `${formatDateToYMD(date)}, ${date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }
}

