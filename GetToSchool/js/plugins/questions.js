const QUESTIONS = [
    {
        prompt: "Which of these elements takes the user to a new page?",
        correctAnswer: 3,
        answers: [
            { answer: "anchor", weight: 1, color: "#00ff00" },
            { answer: "link", weight: 1, color: "#00ffff" },
            { answer: "a", weight: 1, color: "#ffff00" },
            { answer: "url", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "What element manages how things appear on the page, but does not show anything on the page itself?",
        correctAnswer: 2,
        answers: [
            { answer: "header", weight: 1, color: "#00ff00" },
            { answer: "head", weight: 1, color: "#00ffff" },
            { answer: "h1", weight: 1, color: "#ffff00" },
            { answer: "body", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "Which element contains the main content of the page that the user can see?",
        correctAnswer: 4,
        answers: [
            { answer: "header", weight: 1, color: "#00ff00" },
            { answer: "head", weight: 1, color: "#00ffff" },
            { answer: "content", weight: 1, color: "#ffff00" },
            { answer: "body", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "What display property should a parent element get to display its children on one line?",
        correctAnswer: 1,
        answers: [
            { answer: "flex", weight: 1, color: "#00ff00" },
            { answer: "auto", weight: 1, color: "#00ffff" },
            { answer: "none", weight: 1, color: "#ffff00" },
            { answer: "wrap", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "What tag is used to insert an image in HTML?",
        correctAnswer: 2,
        answers: [
            { answer: "pic", weight: 1, color: "#00ff00" },
            { answer: "img", weight: 1, color: "#00ffff" },
            { answer: "image", weight: 1, color: "#ffff00" },
            { answer: "src", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "Which attribute sets the destination of a link?",
        correctAnswer: 3,
        answers: [
            { answer: "link", weight: 1, color: "#00ff00" },
            { answer: "ref", weight: 1, color: "#00ffff" },
            { answer: "href", weight: 1, color: "#ffff00" },
            { answer: "dest", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "Which tag creates a list with bullets?",
        correctAnswer: 1,
        answers: [
            { answer: "ul", weight: 1, color: "#00ff00" },
            { answer: "ol", weight: 1, color: "#00ffff" },
            { answer: "li", weight: 1, color: "#ffff00" },
            { answer: "list", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "How do you make text bold in HTML?",
        correctAnswer: 4,
        answers: [
            { answer: "<stronger>", weight: 1, color: "#00ff00" },
            { answer: "<bold>", weight: 1, color: "#00ffff" },
            { answer: "<text-bold>", weight: 1, color: "#ffff00" },
            { answer: "<strong>", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "What CSS property changes the text color?",
        correctAnswer: 2,
        answers: [
            { answer: "text-color", weight: 1, color: "#00ff00" },
            { answer: "color", weight: 1, color: "#00ffff" },
            { answer: "font-color", weight: 1, color: "#ffff00" },
            { answer: "foreground", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "Which of the following is a block-level element?",
        correctAnswer: 1,
        answers: [
            { answer: "<div>", weight: 1, color: "#00ff00" },
            { answer: "<span>", weight: 1, color: "#00ffff" },
            { answer: "<img>", weight: 1, color: "#ffff00" },
            { answer: "<a>", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "Which tag is used to create a table row?",
        correctAnswer: 2,
        answers: [
            { answer: "<td>", weight: 1, color: "#00ff00" },
            { answer: "<tr>", weight: 1, color: "#00ffff" },
            { answer: "<th>", weight: 1, color: "#ffff00" },
            { answer: "<table-row>", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "What does the 'id' attribute do?",
        correctAnswer: 3,
        answers: [
            { answer: "Styles a group of elements", weight: 1, color: "#00ff00" },
            { answer: "Creates a hyperlink", weight: 1, color: "#00ffff" },
            { answer: "Uniquely identifies an element", weight: 1, color: "#ffff00" },
            { answer: "Sets image size", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "How do you apply a class to an element in HTML?",
        correctAnswer: 4,
        answers: [
            { answer: "id='classname'", weight: 1, color: "#00ff00" },
            { answer: "style='classname'", weight: 1, color: "#00ffff" },
            { answer: "apply='classname'", weight: 1, color: "#ffff00" },
            { answer: "class='classname'", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "What property controls the size of text?",
        correctAnswer: 1,
        answers: [
            { answer: "font-size", weight: 1, color: "#00ff00" },
            { answer: "text-scale", weight: 1, color: "#00ffff" },
            { answer: "size", weight: 1, color: "#ffff00" },
            { answer: "text-size", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "What does the <em> tag do?",
        correctAnswer: 2,
        answers: [
            { answer: "Makes text bold", weight: 1, color: "#00ff00" },
            { answer: "Adds emphasis (italic)", weight: 1, color: "#00ffff" },
            { answer: "Underlines text", weight: 1, color: "#ffff00" },
            { answer: "Adds a link", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "What does CSS stand for?",
        correctAnswer: 1,
        answers: [
            { answer: "Cascading Style Sheets", weight: 1, color: "#00ff00" },
            { answer: "Creative Style Syntax", weight: 1, color: "#00ffff" },
            { answer: "Computer Styled Sections", weight: 1, color: "#ffff00" },
            { answer: "Code Styling Structure", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "Which symbol is used to select a class in CSS?",
        correctAnswer: 2,
        answers: [
            { answer: "#", weight: 1, color: "#00ff00" },
            { answer: ".", weight: 1, color: "#00ffff" },
            { answer: "@", weight: 1, color: "#ffff00" },
            { answer: "&", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "How do you center text in CSS?",
        correctAnswer: 4,
        answers: [
            { answer: "text-align: left;", weight: 1, color: "#00ff00" },
            { answer: "align-text: center;", weight: 1, color: "#00ffff" },
            { answer: "center-text: true;", weight: 1, color: "#ffff00" },
            { answer: "text-align: center;", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "Which tag is used to create a line break?",
        correctAnswer: 1,
        answers: [
            { answer: "<br>", weight: 1, color: "#00ff00" },
            { answer: "<lb>", weight: 1, color: "#00ffff" },
            { answer: "<break>", weight: 1, color: "#ffff00" },
            { answer: "<line>", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "Which of the following closes a tag in HTML?",
        correctAnswer: 2,
        answers: [
            { answer: "<tag>", weight: 1, color: "#00ff00" },
            { answer: "</tag>", weight: 1, color: "#00ffff" },
            { answer: "tag/>", weight: 1, color: "#ffff00" },
            { answer: "<tag/>", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "What CSS property is used to set the background color?",
        correctAnswer: 1,
        answers: [
            { answer: "background-color", weight: 1, color: "#00ff00" },
            { answer: "bg-color", weight: 1, color: "#00ffff" },
            { answer: "color-bg", weight: 1, color: "#ffff00" },
            { answer: "bg", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "Which tag is used to define a paragraph?",
        correctAnswer: 3,
        answers: [
            { answer: "<text>", weight: 1, color: "#00ff00" },
            { answer: "<pgraph>", weight: 1, color: "#00ffff" },
            { answer: "<p>", weight: 1, color: "#ffff00" },
            { answer: "<para>", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "How do you make a numbered list?",
        correctAnswer: 2,
        answers: [
            { answer: "<ul>", weight: 1, color: "#00ff00" },
            { answer: "<ol>", weight: 1, color: "#00ffff" },
            { answer: "<list type='numbered'>", weight: 1, color: "#ffff00" },
            { answer: "<li>", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "What unit is typically used for font sizes in web design?",
        correctAnswer: 4,
        answers: [
            { answer: "pxl", weight: 1, color: "#00ff00" },
            { answer: "%", weight: 1, color: "#00ffff" },
            { answer: "inch", weight: 1, color: "#ffff00" },
            { answer: "px", weight: 1, color: "#ff0000" }
        ]
    },
    {
        prompt: "Which of these tags is self-closing?",
        correctAnswer: 1,
        answers: [
            { answer: "<img />", weight: 1, color: "#00ff00" },
            { answer: "<div>", weight: 1, color: "#00ffff" },
            { answer: "<p>", weight: 1, color: "#ffff00" },
            { answer: "<a>", weight: 1, color: "#ff0000" }
        ]
    }
];
