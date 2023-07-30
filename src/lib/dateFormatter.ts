import { format } from "date-fns"

export const dateFormatter = (date:Date) => {
    return format(new Date(date), "MMM d',' yyy 'at' HH':'mm");
}