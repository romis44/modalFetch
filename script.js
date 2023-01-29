const form = document.querySelector('.form');
const list = document.querySelector('.list');
const loadMoreBtn = document.querySelector('.load-more');

const closeBtn = document.querySelector('.btn-close');
const backdrop = document.querySelector('.backdrop');
const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal-img');

let query = '';
let pageToSearch = 0;

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
list.addEventListener('click', onListClick);
closeBtn.addEventListener('click', onCloseBtnClick);

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/';
const API_KEY = '9cTjAjlRB53wyhAFk5VzXcBu5GiPU6fK';

async function fetchData(query, page) {
  const searchParams = new URLSearchParams({
    apikey: API_KEY,
    keyword: query,
    page,
    size: 100,
  });

  const response = await fetch(`${BASE_URL}events?${searchParams}`);
  if (!response.ok) {
    throw new Error(response.status.Text);
  }

  const data = await response.json();
  return data;
}

async function getEvents(query, page) {
  try {
    const data = await fetchData(query, page);

    if (!data.page.totalElements) {
      loadMoreBtn.classList.add('is-hidden');
      return alert(`No events find for ${query}`);
    }

    if (data.page.totalElements) {
      loadMoreBtn.classList.remove('is-hidden');
    }

    if (pageToSearch >= data.page.totalPages - 1) {
      loadMoreBtn.classList.add('is-hidden');
      alert(`Max result `);
    }
    renderEvents(data._embedded.events);
  } catch (error) {}
}

function renderEvents(data) {
  const markup = data
    .map(
      ({ name, id, images }) => `
    <li id="${id}" data-img="${images[0].url}">
        <p>Name ${name}</p>
    </li>
    `
    )
    .join('');

  list.insertAdjacentHTML('beforeend', markup);
}

function onFormSubmit(e) {
  e.preventDefault();

  list.innerHTML = '';
  pageToSearch = 0;
  query = e.target.elements.query.value;

  if (!query) {
    alert('Input some data');
  }

  getEvents(query, pageToSearch);
}

function onLoadMoreBtnClick() {
  pageToSearch += 1;

  getEvents(query, pageToSearch);
}

function onListClick(e) {
  if (e.target.nodeName === 'UL') return;

  backdrop.classList.remove('is-hidden');

  const imgSrc = e.target.parentNode.dataset.img;
  modalImg.src = imgSrc;
}

function onCloseBtnClick() {
  backdrop.classList.add('is-hidden');
  modalImg.innerHTML = '';
}