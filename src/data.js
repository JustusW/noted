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
    }

    makeID() {
        this.id = Tracker.getId()
    }
}

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
                let note = new Note(n)
                note.container = false
                notes.push(note)
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
        this.compact = ref.compact || true

        let notes = []
        if (ref.notes) {
            for (let n of ref.notes) {
                let note = new Note(n)
                note.container = true
                notes.push(note)
            }
        }
        this.notes = notes
    }

}

function setAnchor(data) {
    localStorage.anchor = JSON.stringify(data)
}

function loadHelp() {
    return new Anchor({"bgcolor":"#C5CAE98F","container":[],"notes":[{"x":607,"y":257,"z":0,"width":774,"height":376,"locked":false,"editing":false,"id":11,"text":"<h2>Welcome to Noted!</h2><p>&nbsp;</p><p>Noted is the system for your thought process. However you like to organize things, Noted will help you.</p><p>In order to get started quickly here's a few things to help you with this User Interface!</p><p>&nbsp;</p><ol><li><a href=\"#/help/12\">Making Notes</a></li><li>Adding Images</li><li>Making Links</li><li>Making Grids</li><li>Options and further reading</li></ol>","container":false},{"x":653,"y":1339,"z":0,"width":665,"height":284,"locked":false,"editing":false,"id":12,"text":"<h2>Making Notes</h2><p>&nbsp;</p><p>You can click anywhere on your screen to make a note!</p><p>Just type in some text and then press the Enter Key or click on the checkmark!</p><p>Try it below this note!</p><p><a href=\"#/help/13\">Continue</a></p>","container":false},{"x":670,"y":2283,"z":0,"width":641,"height":286,"locked":false,"editing":false,"id":13,"text":"<h2>Editing, Moving and Resizing</h2><p>After insertion any Note will be in Editing Mode to allow you to just put in whatever you want. In order to move and resize your note you need to leave the edit mode.</p><p>Just Click on the pencil symbol!</p><p>Move your note below this one and size it to whatever you feel like!</p><p><a href=\"#/help/14\">Continue</a></p>","container":false},{"x":658,"y":3208,"z":0,"width":663,"height":250,"locked":false,"editing":false,"id":14,"text":"<h2>Moving the Canvas</h2><p>In addition to the notes you can also move the entire canvas and zoom to have what you need visible as you need it.</p><p>Move the Canvas by holding the left mouse button down on a free spot and then moving your mouse!</p><p>Move the Canvas so this note is on the top right corner!</p>","container":false},{"x":-222,"y":3502,"z":0,"width":273,"height":261,"locked":false,"editing":false,"id":15,"text":"<h2>Congratulations!</h2><p>&nbsp;</p><p>You have mastered the first step on your journey with Noted!</p><p>Continue with adding images or <a href=\"#/help/11\">return to the index!</a></p>","container":false}],"scale":1})
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


export {loadHelp, setAnchor, getAnchor, Base, Anchor, Note, Container}
export default getAnchor