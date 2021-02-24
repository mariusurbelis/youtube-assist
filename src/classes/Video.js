export default class Video {
    Title = "";
    Description = "";
    Tags = "";

    constructor(_title, _description, _tags) {
        this.Title = _title;
        this.Description = _description;
        this.Tags = _tags;
    }

    getVideo() {
        return `${this.Title} ${this.Description} ${this.Tags}`;
    }
}
