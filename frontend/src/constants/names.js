export const LOGO_IMAGE_PATH = '../images/espire-logo.svg'

export const LOGO_NOWORDS_IMAGE_PATH = '../images/espire-logo-noname.png'

export const NAVBAR_ITEMS = [
    {
        name: 'Library',
        link: '/library',
    },
    {
        name: 'Databank',
        link: '/databank',
    },
    {
        name: 'Dashboard',
        link: '/dashboard',
    },
];

export const NAVBAR_BTNS = (user_status) => {
    if (user_status) {
        return [
            {
                name: 'Login',
                link: '/login',
            },
            {
                name: 'Register',
                link: '/register',
            }
        ]
    } else {
        return [
            {
                name: 'Post',
                link: '/post',
            }
        ]
    }
}

export const ADVERTISEMENT_HEADING = "Enhance your learning experience!"

export const ADVERTISEMENT_TEXT = "Empowering students to improve memory retention, understanding, and academic performance through an all in one article repository."

export const ADVERTISEMENT_IMAGE_PATH = "../images/home-advertisement.png"

export const SERVICES_HEADING_TOP = "From memory retention to deeper understanding, our platform offers a range of interactive tools"

export const SERVICES_HEADING = "to elevate your experience."

export const SERVICES_ITEMS = [
    {
        name: "Collect articles together!",
        lst: [
            "Post important information in articles",
            "Put them in collections",
            "Compare findings",
        ]
    },
    {
        name: "Test yourself!",
        lst: [
            "Create flashcards to test statistics",
            "Increase memory retention",
            "Compare findings",
        ]
    },
    {
        name: "Grow through collaboration!",
        lst: [
            "View how other users understand similar articles",
            "Generate discussions through commenting",
            "Save to your library",
        ]
    },
]

export const FLOW_ITEMS = [
    {
        name: "Streamline your Research Process!",
        description: "No more cluttered browser windows or endless tabs to navigate. With our platform, you'll enjoy a clutter-free workspace designed for maximum efficiency. ",
        img: '../images/home-flow1.png'
    },
    {
        name: "Consolidate Your Sources!",
        description: "Access all your sources with just a few clicks, allowing you to focus on your research without distractions.",
        img: '../images/home-flow2.png'
    },
    {
        name: "Master Concepts!",
        description: "Utilize built-in flashcards to aid memory retention, allowing you to reinforce key concepts effortlessly. Spend less time searching and more time mastering your material with confidence.",
        img: '../images/home-flow3.png'
    },
]

export const ACTION_TEXT = "JOIN US NOW!"

export const END_COMPANY_NAME = "Espire Pte. Ltd."

export const END_COMPANY_DESCRIPTION = "Espire Pte. Ltd. is a student-led initiative, made by students for students. Our mission is to revolutionize learning through cutting-edge technology and collaborative platforms, ensuring every individual has the tools they need to succeed. Join us in shaping the future of education."

export const END_CONTACT_US_HEAD = "Contact Us:"

export const END_CONTACT_US_PHONE = "Phone: +123-456-7890"

export const END_CONTACT_US_EMAIL = "Email: info@espire.com"

export const END_CONTACT_US_ADDRESS1 = "21 Lower Kent Ridge Rd," 

export const END_CONTACT_US_ADDRESS2 = "Singapore 119077"


export const REGISTER_PATHNAME="/register"

export const LOGIN="Login"
export const REGISTER="Register"
export const LOGIN_PATHNAME="/login"
export const LOGIN_SIDEBAR_TITLE="Don’t have an account?"
export const REGISTER_SIDEBAR_TITLE="Welcome Back!"
export const SIGNUP="SIGN UP"
export const SIGNIN="SIGN IN"


export const TAB1="Articles"
export const TAB2="Folders"
