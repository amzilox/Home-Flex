'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const parentContainer = document.querySelector('.operations__tab-container');
const tabBtns = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navItem = document.querySelector('.nav__link');
const navListItem = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const toRight = document.querySelector('.slider__btn--right');
const toLeft = document.querySelector('.slider__btn--left');
const dots = document.querySelector('.dots');
let slideNum = 0;

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/// Implimenting the Smooth scrolling:

btnScrollTo.addEventListener('click', function (e) {
  const coords1 = section1.getBoundingClientRect();

  // window.scrollTo({
  //   top: coords1.top + window.pageYOffset,
  //   left: coords1.left + window.pageXOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// Implimenting the Smooth scrolling on nav links :
// (Event Delegation consist of :)
// => 1. Add Event Listener to common parent element
// => 2. Determine what element originated the event

nav.addEventListener('click', function (e) {
  e.preventDefault();

  // Matching Strategy: (Guard Clause)
  if (!e.target.classList.contains('nav__link')) return;
  const id = e.target.getAttribute('href');
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////:::

// Tab Component

parentContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  [...this.children].forEach(btn =>
    btn.classList.remove('operations__tab--active')
  );
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(child => {
    child.classList.remove('operations__content--active');
    if (child.classList.contains(`operations__content--${clicked.dataset.tab}`))
      child.classList.add('operations__content--active');
  });
});

// Menu fade animation

// handlerFunction:

function handelHover(e) {
  if (!e.target.classList.contains('nav__link')) return;
  const hovered = e.target;
  const siblings = nav.querySelectorAll('.nav__link');
  const img = nav.querySelector('img');

  siblings.forEach(el => {
    if (el == hovered) return;
    el.style.opacity = this;
  });
  img.style.opacity = this;
}

nav.addEventListener('mouseover', handelHover.bind(0.5));

nav.addEventListener('mouseout', handelHover.bind(1));

//////////////////

// Sticky Navigation:
const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

function stickyNav(entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}
headerObserver.observe(header);

// Reveal sections:

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images:

const imgs = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgs.forEach(img => imgObserver.observe(img));

// Implimenting Slides logic:
function SliderComponent() {
  function MoveSlide(slide) {
    slides.forEach((item, i) => {
      item.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  }
  // Create dots:
  function CreatDots() {
    slides.forEach((_, i) => {
      dots.insertAdjacentHTML(
        'beforeend',
        `
      <button class="dots__dot" data-slide="${i}"></button>
      `
      );
    });
  }

  //Logic of active Dot:

  function activeDot(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  // Init function:

  (function () {
    MoveSlide(0);
    CreatDots();
    activeDot(0);
  })();

  // LOGIC:
  function moveToRight() {
    if (slideNum == slides.length - 1) {
      slideNum = 0;
    } else {
      slideNum++;
    }

    MoveSlide(slideNum);
    activeDot(slideNum);
  }

  function moveToLeft() {
    if (slideNum == 0) {
      slideNum = slides.length - 1;
    } else {
      slideNum--;
    }

    MoveSlide(slideNum);
    activeDot(slideNum);
  }

  // EVENTLISTENERS:
  toRight.addEventListener('click', moveToRight);
  toLeft.addEventListener('click', moveToLeft);

  dots.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    let { slide } = e.target.dataset;

    MoveSlide(slide);
    activeDot(slide);
  });

  // Keyboard Control:

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && moveToRight();
    e.key === 'ArrowLeft' && moveToLeft();
  });
}
SliderComponent();
