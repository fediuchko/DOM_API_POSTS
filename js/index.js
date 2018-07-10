// window.onload=()=>{
//     fetch('https://api.myjson.com/bins/152f9j')
//     .then(response=>{
//         response.json().then(data=>{
//             var obj = JSON.parse(data.data);
//             console.log(obj.length);

//         });
//     })
//     .catch(err=>{
//         console.log(err);
//     });
// };
// function createlist(data){
// var ul = document.createElement("ul");
// document.body.appendChild(ul);
// console.log("createlist");
// console.log("createlist datalendth - "+data.length);
// for (var i = 0; i <data.length; i++)
// {

//     var li = document.createElement("li");  
//     li.className = "post";

//     var a = document.createElement("a");
//     a.innerHTML = data[i].title;

//     li.appendChild(a);
//     ul.appendChild(li);
// }
// }
window.onbeforeunload = function () {
    localStorage.setItem("sortType", sortType);
    localStorage.setItem("setOfTagsForSearch", JSON.stringify(setOfTagsForSearch));


};

window.onload = function () {
    sortType = localStorage.getItem("sortType");
};
var sortType;
var tagsSet = new Set();
var setOfTagsForSearch = [];

function createNode(element, className) {
    let node = document.createElement(element);
    node.className = className;
    return node;
}
function createButton(buttonText, clickFunction) {
    var btn = document.createElement("BUTTON");
    btn.className = "BUTTON"
    var t = document.createTextNode(buttonText);
    btn.appendChild(t);
    btn.addEventListener("click", clickFunction)
    return btn;
}
function createCheckBox(buttonText, clickFunction) {
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", buttonText);

    
    checkbox. addEventListener("click", clickFunction)
    checkbox.checked = false;
    return checkbox;
}

function append(parent, el) {
    return parent.appendChild(el);
}

const ul = document.getElementById('posts');
const searchTagsUl = document.getElementById('tags_list');

var posts;
const url = 'https://api.myjson.com/bins/152f9j?results=10';
fetch(url)
.then((resp) => resp.json())
.then(data=> {
    posts = data.data;
    if (sortType === "inc") { sortPostsIncrease(); } else if (sortType === "byTag") {
        setOfTagsForSearch = JSON.parse(localStorage.getItem("setOfTagsForSearch"));
        console.log("setOfTagsForSearch " + setOfTagsForSearch.length);
        sortPostsByTags();
    } else { sortPostsDecrease(); }
    posts.map(post=> {
        let li = createNode('li', "listItem"),
            img = createNode('img', "image"),
            spanTitle = createNode('span', "title");
        spanDescription = createNode('span', "description");
        spanDate = createNode('span', "date");
        ulTags = createNode('ul', "ulTags");

        post.tags.map(tag=> {
            tagsSet.add(tag)
            liTags = createNode('li', "tagList");
            let spanTag = createNode('span', "tagItem");
            console.log(liTags);
            spanTag.innerHTML = tag;
            append(liTags, spanTag);
            append(ulTags, liTags);
        })
        removeItemBtn = createButton("Remove", function () { li.parentNode.removeChild(li) });

        img.src = post.image;
        spanTitle.innerHTML = `${post.title} `;
        spanDescription.innerHTML = `${post.description} `;
        spanDate.innerHTML = `${new Date(post.createdAt).getUTCFullYear()} `;
        console.log(new Date(post.createdAt).getUTCFullYear());
        append(li, img);
        append(li, spanTitle);
        append(li, spanDescription);
        append(li, spanDate);
        append(li, ulTags);
        append(ul, li);
        append(li, removeItemBtn)

    })
    console.log(tagsSet)
    tagsSet.forEach(function (tag) {
        console.log(tag);
        let searchTagLi = createNode('li', "searchTag");
            spanTag = createNode('span', "titleTag");
        spanTag.innerHTML = tag;
        let checkbox = createCheckBox(tag, function () {
            var check = document.getElementById(tag)
            if (check.checked) {
                setOfTagsForSearch=[]
                setOfTagsForSearch.push(tag);
                sortType = "byTag";
                document.location.reload(true)
            } else {
                while (setOfTagsForSearch.indexOf(tag) !== -1) {
                    delete setOfTagsForSearch[setOfTagsForSearch.indexOf(tag)];
                  }
                if (setOfTagsForSearch.length > 0) { sortType = "byTag" } else { sortType = "" }
                document.location.reload(true)
            }
            console.log( "checkbox triger - "  + (check.checked == true))
        });
        append(searchTagLi, checkbox);
        append(searchTagLi, spanTag);

        append(searchTagsUl, searchTagLi);
    });
    //for (let tag of tagsSet) {
    //    console.log(tags)
    //    let searchTagLi = createNode('li', "searchTag");
    //    searchTagLi.innerHTML = tag;
    //    append(searchTagsUl, searchTagLi);

    //}



})
.catch(function (error) {
    console.log(JSON.stringify(error));
});

function sortPostsDecrease() {
    return posts.sort((post1, post2) => { return ((new Date(post2.createdAt)).getUTCFullYear()) - (new Date(post1.createdAt)).getUTCFullYear() });
}
function sortPostsIncrease() {
    return posts.sort((post1, post2) => { return ((new Date(post1.createdAt)).getUTCFullYear()) - (new Date(post2.createdAt)).getUTCFullYear() });
}
function sortPostsByTags() {
    let currentTag = setOfTagsForSearch[0];
   var firstpartposts=[];
   var secondpartposts=[];

    posts.map(post=> {  
        if(post.tags.includes(currentTag)){firstpartposts.push(post)}else{secondpartposts.push(post)} 
    });
    posts=[];
    firstpartposts.sort((post1, post2) => { return ((new Date(post2.createdAt)).getUTCFullYear()) - (new Date(post1.createdAt)).getUTCFullYear() });
    secondpartposts.sort((post1, post2) => { return ((new Date(post2.createdAt)).getUTCFullYear()) - (new Date(post1.createdAt)).getUTCFullYear() });
    posts = firstpartposts.concat(secondpartposts);

}


function searchByTitle() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    console.log(filter)
    ul = document.getElementById('posts');
    li = ul.getElementsByClassName("listItem");
    console.log("li.lengt - " + li.length);

    for (i = 0; i < li.length; i++) {
        console.log("a= " + li[i].getElementsByClassName("title")[0].innerHTML)

        a = li[i].getElementsByClassName("title")[0];
        console.log("a= " + a.innerHTML)
        if (a.innerHTML.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            this.console.log(openDropdown)
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
function increaseClick() {
    sortType = "inc"
    sortPostsIncrease()
    document.location.reload(true)
}
function decreaseClick() {
    sortType = "";
    sortPostsDecrease()
    document.location.reload(true)
}








