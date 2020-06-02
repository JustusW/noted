class Tracker {
    static bases = []

    static register(base) {
        this.bases.push(base)
    }

    static getId() {
        let id = 0
        for (let b of this.bases) {
            if (Number.isSafeInteger(b.id))
                id = Math.max(b.id, id)
        }
        return id + 1
    }
}


class Base extends Object {
    constructor(ref) {
        super();
        Tracker.register(this)

        this.x = ref.x || 0
        this.y = ref.y || 0
        this.z = ref.z || 0
        this.width = ref.width || 200
        this.height = ref.height || 200
        this.locked = ref.locked || false
        this.editing = ref.editing || false
        this.id = ref.id

        if (!this.id || !Number.isSafeInteger(this.id)) {
            this.makeID()
        }
        console.log(Tracker.getId(), this.id)
    }

    makeID() {
        this.id = Tracker.getId()
    }
}
console.log(Base)

class Anchor extends Object {
    constructor(ref) {
        super();

        this.bgcolor = ref.bgcolor || '#fff'

        let containers = []
        if (ref.container) {
            for (let c of ref.container) {
                containers.push(new Container(c))
            }
        }
        this.container = containers

        let notes = []
        if (ref.notes) {
            for (let n of ref.notes) {
                notes.push(new Note(n))
            }
        }
        this.notes = notes
    }
}

class Note extends Base {
    constructor(ref) {
        super(ref);
        this.text = ref.text
    }
}

class Container extends Base {
    constructor(ref) {
        super(ref);

        this.cols = ref.cols || 3

        let notes = []
        if (ref.notes) {
            for (let n of ref.notes) {
                notes.push(new Note(n))
            }
        }
        this.notes = notes
    }

}

function setAnchor(data) {
    localStorage.anchor = JSON.stringify(data)
}

function getAnchor() {
    if (!localStorage.anchor) {
        setAnchor({
            container: [],
            notes: [],
            color: '#fff',
        })
    }

    let anchor = JSON.parse(localStorage.anchor)

    return new Anchor(anchor)
}


export {setAnchor, getAnchor, Base, Anchor, Note, Container}
export default getAnchor