export class User{
    name;
    genre;
    icon;
    paid;
    owed;

    constructor(name, genre, icon) {
        this.name = name;
        this.genre = genre;
        this.icon = icon;
        this.paid = 0;
        this.owed = 0;
    }
}