const tableElement = document.getElementById('table-results');
let updatedPostId = ''
document.addEventListener('DOMContentLoaded',()=>{
    fetchPosts();
});

function fetchPosts(){
    const postUrl = "https://jsonplaceholder.typicode.com/posts";

    fetch(postUrl,{
        method:'GET',
        headers:{
            'Content-type':'application/json;charset=UTF-8'
        },
    }).then((response) => {
        return response.json();
    })
    .then((posts) => {
        // console.log(posts);
        let tableRows = '';
        for (let post of posts){
            tableRows +=`
            <tr>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.body}</td>
            <td>
            <div class="btn-container">
            <button class="edit-post">Edit</button>
            <button class="delete-post" id="Delete">Delete</button>
            </div>
            </td>
            </tr>`

        }
        // console.log(tableRows);
         tableElement.innerHTML = tableRows;
    });
}

let addPostButton = document.getElementById('add-postbtn');
addPostButton.addEventListener('click', () => {
    let addModel = document.getElementById('add-model');
    addModel.style.display='block'
})

const closeElements =document.getElementsByClassName("close");

for(let closeElement of closeElements){
closeElement.addEventListener('click',(e)=>{
    e.preventDefault();
    closeModelDialog();
});
}

function closeModelDialog() {
    let addModel = document.getElementById('add-model');
    addModel.style.display = 'none';
    document.getElementById('update-model').style.display ='none'
}




//adding Post 
const addModel = document.getElementById('add-model');

addModel.addEventListener('submit',(e) => {
    console.log(e.target)
    e.preventDefault();
    const name = document.getElementById('title').value;
    const data = document.getElementById('description').value;



    // const headersData = new Headers();
    // headersData.append('content-type','application/json');
    // headersData.append('user','suresh');

    // let postData = {
    //     name:name,
    //     data:data
    // };

    // console.log(postData)

    fetch('https://jsonplaceholder.typicode.com/posts',{
        method:'POST',
        body:JSON.stringify({
            name:name,
            data:data
        }),
        headers:{
            'Content-type':'application/json;charset=UTF-8'
        },
    })
    .then((response) =>
        response.json(),
        fetchPosts(),
        closeModelDialog(),
        e.target.reset()
    )
    .then((json) => console.log(json))
})


tableElement.addEventListener('click',(e)=> {
    let target = e.target;

    

    console.log(target);
    if(target.classList.contains('edit-post')){
        document.getElementById('update-model').style.display='block';


        const postId =  target.parentElement.parentElement.parentElement.firstElementChild.textContent;
        // console.log(postId);
        updatedPostId = postId;
        
    

        fetch('https://jsonplaceholder.typicode.com/posts',{
            method:'GET',
        }).then((response) =>{
            return response.json();
        })
        .then((posts) => {
            // console.log(posts)
            let selectedPost = posts.find(post => post.id === Number(postId));
            // console.log(selectedPost);
            populateModelFields(selectedPost);
        })
    }
})

let populateModelFields =(post) => {
    document.getElementById('titleUpdate').value = post.title;
    document.getElementById('descriptionUpdate').value = post.body;
}

const updateModel = document.querySelector('#update-model form');
updateModel.addEventListener('submit',(e) => {
    e.preventDefault();
    let title = document.getElementById('titleUpdate').value;
    let description = document.getElementById('descriptionUpdate').value;
    console.log(updatedPostId);
    // console.log(title);
    // console.log(description);
    


    fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPostId}`, {
        method:'PUT',
        body:JSON.stringify({
            title,
            description
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },

    })
    .then((response) =>
    console.log(response)
    )
    // .then((json) => console.log(json))
})

// tableElement.addEventListener('click',(e) => {
//     let target = e.target;
//     if (target.classList.contains('delete-post')){
//         let postId = target.parentElement.parentElement.parentElement.firstElementChild.textContent;
//         updatedPostId=postId
//         fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPostId}`,{
//             method:'DELETE',
//         }).then((response)=>{
//             // console.log(response);
//             fetchPosts();
//         })
//     }
// }) 

tableElement.addEventListener('click',(e) => {
    let target = e.target;
    if (target.classList.contains('delete-post')){
        let postId = target.parentElement.parentElement.parentElement.firstElementChild.textContent;
        updatedPostId=postId
        // Display a confirmation dialog
        if (confirm("Are you sure you want to delete this post?")) {
            fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPostId}`,{
                method:'DELETE',
            }).then((response)=>{
                // console.log(response);
                fetchPosts();
            })
        }
    }
})
