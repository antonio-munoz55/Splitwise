export class Spend{
    user;
    amount;
    title;
    date;

    constructor(user, amount, title, date) {
        this.user = user;
        this.amount = amount;
        this.title = title;
        this.date = date;
    }
}