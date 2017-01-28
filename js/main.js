/** Created by markhentschel on 1/21/17. **/
(function(){

	'use strict';

	const REQUEST = new XMLHttpRequest();
	const HOT_REPO_HEAD = '<div class="col col1">id</div>'
		+ '<div class="col col2">name</div>'
		+ '<div class="col col3">description</div>'
		+ '<div class="col col4">stars</div>';
	const HOT_REPO = {
		'id' : 'hot_repo',
		'title': 'Hottest Repositories',
		'url': 'https://api.github.com/search/repositories?q=stars%3A>1000&sort=stars&order=desc',
		'listHead': HOT_REPO_HEAD,
		'columns': ['id', 'name', 'description', 'stargazers_count']
	};
	const PROLIFIC_USERS_HEAD = '<div class="col col1">id</div>'
		+ '<div class="col col2">login</div>'
		+ '<div class="col col3">avatar</div>'
		+ '<div class="col col4">followers</div>';
	const PROLIFIC_USERS = {
		'id' : 'prolific_users',
		'title': 'Prolific Users',
		'url': 'https://api.github.com/search/users?q=followers%3A>1000&sort=followers&order=desc',
		'listHead': PROLIFIC_USERS_HEAD,
		'columns': ['id', 'login', 'avatar_url', 'followers']
	};
	let firstRun = true;
	let currentList = HOT_REPO;
	let startListCycle = () => setTimeout(getList, 2000);

	//init call and cycle
	getList();
	document.querySelector('h2').innerHTML = currentList.title;
	//listener for #hot_repo
	document.getElementById("hot_repo").addEventListener("click", () => updateList(HOT_REPO));
	//listener for #prolific_users
	document.getElementById("prolific_users").addEventListener("click", () => updateList(PROLIFIC_USERS));

	function getList(){
		//REQUEST.onload = createList;
		REQUEST.onreadystatechange = () => {
			if (REQUEST.readyState == 4 && REQUEST.status == 200){
				(firstRun) ? firstRun = false : clearList();
				createList(REQUEST.responseText);
				//setup auto refresh
				startListCycle();
			} else if (REQUEST.readyState == 4 && REQUEST.status != 200 && REQUEST.status != 0){
				let body = document.getElementById('list_body');
				body.innerHTML = 'something went wrong!';
			}
		}
		// Initialize the request
		REQUEST.open('get', currentList.url, true);
		REQUEST.send();
	}

	function createList(data) {
		let responseObj = JSON.parse(data);
		console.log(responseObj);
		let head = document.getElementById('list_head');
		head.innerHTML = currentList.listHead;
		let body = document.getElementById('list_body');
		let items = "";
		for (let i=0; i<5; i++){
			items += '<div class="col col1">'+responseObj.items[i][currentList.columns[0]]+'</div>'
				+ '<div class="col col2">'+responseObj.items[i][currentList.columns[1]]+'</div>'
				+ '<div class="col col3">'+responseObj.items[i][currentList.columns[2]]+'</div>'
				+ '<div class="col col4">'+responseObj.items[i][currentList.columns[3]]+'</div>';
		}
		body.innerHTML = items;
	}

	function clearList() {
		var previousHead = document.getElementById('list_head');
		previousHead.innerHTML = "";
		var previousBody = document.getElementById('list_body');
		previousBody.innerHTML = "";
		console.log('cleared');
	}

	function updateList(c){
		//clear out previous
		clearList();
		//switch list and refresh data
		currentList = c;
		getList();
		//update subhead
		document.querySelector('h2').innerHTML = currentList.title;
	}

})();