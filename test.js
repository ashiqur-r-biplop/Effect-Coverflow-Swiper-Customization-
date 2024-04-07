const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];
console.log([...carousel.children]);
let isDragging = false,
  isAutoPlay = true,
  startX,
  startScrollLeft,
  timeoutId;
console.log(firstCardWidth);
// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate position to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
  });
});

// Function to handle drag start event
const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

// Function to handle dragging event
const dragging = (e) => {
  if (!isDragging) return;
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

// Function to handle drag stop event
const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

// Function to handle infinite scrolling
const infiniteScroll = () => {
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  } else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

// Function to handle autoplay
const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay) return;
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
};

// Call updateActiveSlide function initially and on scroll
const updateActiveSlide = () => {
  // Calculate the middle index based on the scrollLeft position
  const middleIndex = Math.floor(
    (carousel.scrollLeft + carousel.offsetWidth / 1) / firstCardWidth
  );
  console.log(middleIndex);
  carouselChildrens.forEach((slide, index) => {
    if (index === middleIndex) {
      slide.classList.add("active");
      slide.classList.remove("inactive");
    } else {
      slide.classList.remove("active");
      slide.classList.add("inactive");
    }
  });
};
updateActiveSlide();
// Call autoPlay function initially
autoPlay();

// Add event listeners
carousel.addEventListener("scroll", updateActiveSlide);
carousel.addEventListener("mousedown", dragStart, updateActiveSlide);
carousel.addEventListener("mousemove", dragging, updateActiveSlide);
document.addEventListener("mouseup", dragStop, updateActiveSlide);
carousel.addEventListener("scroll", infiniteScroll, updateActiveSlide);
wrapper.addEventListener(
  "mouseenter",
  () => clearTimeout(timeoutId),
  updateActiveSlide
);
wrapper.addEventListener("mouseleave", autoPlay, updateActiveSlide);
