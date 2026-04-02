export const quizQuestions = [
    {
        id: 1,
        question: "Какво е IIFE в JS?",
        options: [
            { id: 1, text: "Internal Immediately Functioned Expression" },
            { id: 2, text: "Immediately Invoked Function Expression" },
            { id: 3, text: "Instantly Invoked Function Execution" },
            { id: 4, text: "Internal Instant Function Execution" }
        ],
        correctAnswer: 2
    },
    {
        id: 2,
        question: "Какво прави операторът === в JS?",
        options: [
            { id: 1, text: "Сравнява за равенство, пропускайки типа" },
            { id: 2, text: "Сравнява само типовете, пропускайки стойностите" },
            { id: 3, text: "Сравнява както стойностите, така и типовете" },
            { id: 4, text: "Няма такъв оператор" }
        ],
        correctAnswer: 3
    },
    {
        id: 3,
        question: "Какво представлява 'closure' в JS?",
        options: [
            { id: 1, text: "Специфичен тип обект" },
            { id: 2, text: "Функция, обвита в друга функция" },
            { id: 3, text: "Функция, която помни и има достъп до своя лексикален обхват, дори когато се извиква извън него" },
            { id: 4, text: "Грешка в кода, която води до недостъпни променливи" }
        ],
        correctAnswer: 3
    },
    {
        id: 4,
        question: "Как се дефинира асинхронна функция в JS?",
        options: [
            { id: 1, text: "async function myFunc(){}" },
            { id: 2, text: "function async myFunc(){}" },
            { id: 3, text: "async() function myFunc(){}" },
            { id: 4, text: "function myFunc() async{}" }
        ],
        correctAnswer: 1
    },
    {
        id: 5,
        question: "Кое изявление за Map обекта в JS е вярно?",
        options: [
            { id: 1, text: "Може да съдържа ключове само от тип String" },
            { id: 2, text: "Запазва реда на въвеждане на елементите" },
            { id: 3, text: "Игнорира дублираните ключове без да издава грешка" },
            { id: 4, text: "Преобразува всички ключове в String" }
        ],
        correctAnswer: 2
    },
    {
        id: 6,
        question: "Каква е основната функция на JSX?",
        options: [
            { id: 1, text: "Да изпраща данни към сървъра" },
            { id: 2, text: "Да управлява състоянията на компоненти" },
            { id: 3, text: "Да декларира структурата на потребителския интерфейс" },
            { id: 4, text: "Да създава функционални модули" }
        ],
        correctAnswer: 3
    },
    {
        id: 7,
        question: "Какъв е правилният синтаксис за препратка към външен скрипт, наречен abc.js?",
        options: [
            { id: 1, text: '<script file="abc.js"></script>' },
            { id: 2, text: '<script src="abc.js"></script>' },
            { id: 3, text: '<script href="abc.js"></script>' },
            { id: 4, text: '<script link="abc.js"></script>' }
        ],
        correctAnswer: 2
    },
    {
        id: 8,
        question: "Как можем да отменим XMLHttpRequest в AJAX?",
        options: [
            { id: 1, text: "request.abort()" },
            { id: 2, text: "request.cancel()" },
            { id: 3, text: "request.stop()" },
            { id: 4, text: "request.clear()" }
        ],
        correctAnswer: 1
    },
    {
        id: 9,
        question: "Кой параметър AJAX GET и POST методите изискват да бъде предоставен?",
        options: [
            { id: 1, text: "HTTP версията" },
            { id: 2, text: "Потребителското име" },
            { id: 3, text: "Типът данни на заявката" },
            { id: 4, text: "URL адресът за заявка" }
        ],
        correctAnswer: 4
    },
    {
        id: 10,
        question: "Какво е състояние (state) в React?",
        options: [
            { id: 1, text: "Глобален обект, който съхранява всички данни" },
            { id: 2, text: "Метод за управление на компоненти" },
            { id: 3, text: "Обект, който съхранява данни, които се променят и поддържа моментното състояние на компонент" },
            { id: 4, text: "Атрибут от JSX" }
        ],
        correctAnswer: 3
    },
    {
        id: 11,
        question: "Какво е събитие в React?",
        options: [
            { id: 1, text: "Метод, който се извиква при взаимодействие с компонента" },
            { id: 2, text: "Атрибут, който задава стил на компонента" },
            { id: 3, text: "Свойство, което показва състоянието" },
            { id: 4, text: "Метод, който опреснява компонента" }
        ],
        correctAnswer: 1
    },
    {
        id: 12,
        question: "Как React Native оптимизира производителността на приложенията за различни платформи, като iOS и Android?",
        options: [
            { id: 1, text: "Използва специфични за платформата компоненти" },
            { id: 2, text: "Ползва един и същ код за всички платформи" },
            { id: 3, text: "Поддържа само Android платформа" },
            { id: 4, text: "Изисква множество кодови бази" }
        ],
        correctAnswer: 1
    },
    {
        id: 13,
        question: "Как се добавя елемент в началото на масив в JS?",
        options: [
            { id: 1, text: "array.push(element)" },
            { id: 2, text: "array.shift(element)" },
            { id: 3, text: "array.unshift(element)" },
            { id: 4, text: "array.splice(0, 0, element)" }
        ],
        correctAnswer: 3
    },
    {
        id: 14,
        question: "Каква е употребата на метода preventDefault в JS?",
        options: [
            { id: 1, text: "Предотвратява изпълнението на всички събития." },
            { id: 2, text: "Предотвратява стандартното поведение на браузъра за дадено събитие." },
            { id: 3, text: "Предотвратява презареждането на страницата." },
            { id: 4, text: "Предотвратява изпълнението на JavaScript код в браузъра." }
        ],
        correctAnswer: 2
    },
    {
        id: 15,
        question: "Каква е ползата от setTimeout в JS?",
        options: [
            { id: 1, text: "Изпълнява функция веднага след като блокът от код бъде изпълнен." },
            { id: 2, text: "Позволява функция да се изпълнява асинхронно след зададено време." },
            { id: 3, text: "Позволява функция да се изпълнява само при случаи на грешка." },
            { id: 4, text: "Изпълнява същата функция многократно, докато страницата е активна." }
        ],
        correctAnswer: 2
    },
    {
        id: 16,
        question: "Каква е целта на ключовата дума let?",
        options: [
            { id: 1, text: "Позволява създаването на константи." },
            { id: 2, text: "Декларира променливи с блоков обхват." },
            { id: 3, text: "Декларира глобални променливи." },
            { id: 4, text: "Изтрива променливи." }
        ],
        correctAnswer: 2
    },
    {
        id: 17,
        question: "Какво е чиста функция (pure function)?",
        options: [
            { id: 1, text: "Функция, която връща резултати базирани само на входните си параметри и не променя външно състояние." },
            { id: 2, text: "Функция, която може да модифицира глобални променливи." },
            { id: 3, text: "Функция, която се изпълнява само веднъж." },
            { id: 4, text: "Функция, която използва само синтаксис ES6." }
        ],
        correctAnswer: 1
    },
    {
        id: 18,
        question: "Какво е асинхронно програмиране и защо е важно в JavaScript?",
        options: [
            { id: 1, text: "Техника за паралелно програмиране, която е основна за синхронни операции." },
            { id: 2, text: "Техника за писане на код, който се изпълнява в строго определен ред." },
            { id: 3, text: "Подход за изпълнение на операции, които не блокират основния поток на програмата." },
            { id: 4, text: "Начин за структуриране на код, който предотвратява грешки." }
        ],
        correctAnswer: 3
    },
    {
        id: 19,
        question: "Каква е разликата между прозорец (window) и документ (document) в JavaScript?",
        options: [
            { id: 1, text: "window представлява текущата HTML страница, а document обектът за работа с нейното съдържание." },
            { id: 2, text: "window е обектът глобалното пространство в браузъра, а document е обектът за работа със съдържанието на HTML страницата." },
            { id: 3, text: "window и document са взаимозаменяеми термини в JavaScript." },
            { id: 4, text: "document е глобалният обект в JavaScript, а window представлява DOM дървото." }
        ],
        correctAnswer: 2
    },
    {
        id: 20,
        question: "Какво е DOM дърво?",
        options: [
            { id: 1, text: "Структура за управление на стилове и анимации." },
            { id: 2, text: "Визуално представяне на данни в табличен вид." },
            { id: 3, text: "Метод за манипулиране на бази данни в JavaScript." },
            { id: 4, text: "Модел за описване на структурата на HTML или XML документ." }
        ],
        correctAnswer: 4
    },
    {
        id: 21,
        question: "Какъв е основният компонент, използван за въвеждане на текст в React Native?",
        options: [
            { id: 1, text: "<TextInput>" },
            { id: 2, text: "<InputField>" },
            { id: 3, text: "<TextField>" },
            { id: 4, text: "<TypeArea>" }
        ],
        correctAnswer: 1
    },
    {
        id: 22,
        question: "Какво представлява Expo в контекста на React Native?",
        options: [
            { id: 1, text: "JavaScript библиотека за анимации" },
            { id: 2, text: "Инструментариум, който улеснява разработката и тестването на React Native приложения" },
            { id: 3, text: "Сървърна платформа за React приложения" },
            { id: 4, text: "Стилова библиотека за интерфейси" }
        ],
        correctAnswer: 2
    },
    {
        id: 23,
        question: "Коя функция е задължителна за всеки клас компонент в React?",
        options: [
            { id: 1, text: "componentDidMount()" },
            { id: 2, text: "shouldComponentUpdate()" },
            { id: 3, text: "render()" },
            { id: 4, text: "getInitialState()" }
        ],
        correctAnswer: 3
    },
    {
        id: 24,
        question: 'Какво означава, когато компонентите в React са "reusable"?',
        options: [
            { id: 1, text: "Те не могат да се променят" },
            { id: 2, text: "Те могат да бъдат използвани повторно в различни части на приложението" },
            { id: 3, text: "Те се изпълняват многократно автоматично" },
            { id: 4, text: "Те изискват много памет" }
        ],
        correctAnswer: 2
    }
];

export default quizQuestions;