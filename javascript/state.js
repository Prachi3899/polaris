<<<<<<< HEAD
// js/state.js

let publishedEntries = [];
let editingArticleId = null;
let drafts = JSON.parse(localStorage.getItem("dhruv_moleskine_drafts")) || [
    { id: "1", title: "", body: "" }
];
let activeDraftId = drafts[0].id;
=======
let publishedEntries = [];
let editingArticleId = null;
>>>>>>> fdd33070c53ed3e95d9949dca616633974a8b562
