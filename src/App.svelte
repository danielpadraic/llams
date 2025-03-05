<script>
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import "@splidejs/svelte-splide/css";
  import PopUpForm from "./PopUpForm.svelte";
  import PopUpCarousel from "./PopUpCarousel.svelte";

  let isMenuOpen = false;
  let popUpType = null;
  let carouselPopUp = false; // Tracks if carousel pop-up is open
  let currentSlideIndex = 0; // Tracks the index of the clicked slide
  let isDrawerOpen = false; // Tracks if the Privacy Policy drawer is open

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  const carouselImages = [
    "/assets/images/carousel/project1.jpg",
    "/assets/images/carousel/project2.jpg",
    "/assets/images/carousel/project3.jpg",
    "/assets/images/carousel/project4.jpg",
    "/assets/images/carousel/project5.jpg",
    "/assets/images/carousel/project6.jpg",
    "/assets/images/carousel/project7.jpg",
    "/assets/images/carousel/project8.jpg",
    "/assets/images/carousel/project9.jpg",
  ];

  // Function to toggle carousel pop-up and set the current slide index
  function toggleCarouselPopUp(index = 0) {
    carouselPopUp = !carouselPopUp;
    if (carouselPopUp) {
      currentSlideIndex = index; // Set the index of the clicked slide
    }
  }

  // Privacy Policy text from attachment 7 (adjusted company name to "llams, LLC" based on context)
  const privacyPolicyText = `
    llams, LLC, a local Idaho Limited Liability Company, owns this website and all associated data. We collect personal information that you voluntarily provide, such as your name and email address, to respond to your inquiries, provide our services, and enhance our website. Rest assured, we will never sell, rent, or share your information with any third parties.

    We implement reasonable measures to safeguard your data, though we cannot guarantee absolute security. You have the right to access, correct, or delete your personal information by contacting us at contact@llamstiny.com. Additionally, our site may use cookies to improve your browsing experience; you can manage your cookie preferences through your browser settings.

    Please note that our website is not intended for children under the age of 13, and we do not knowingly collect information from them. Links to third-party websites are provided for your convenience, but they have their own privacy policies, and we are not responsible for their practices. We may update this Privacy Policy periodically; your continued use of the site constitutes acceptance of any changes. This policy is governed by the laws of the State of Idaho. For any questions or concerns, please contact us at contact@llamstiny.com.
  `;
</script>

<header>
  <div class="logo">llams</div>
  <button class="hamburger" on:click={toggleMenu}>≡</button>
  <nav class:is-open={isMenuOpen}>
    <a href="/tiny-homes" on:click={() => toggleMenu()}>Tiny Homes</a>
    <a href="/projects" on:click={() => toggleMenu()}>Projects</a>
    <a href="/about" on:click={() => toggleMenu()}>About</a>
    <a href="/contact" on:click={() => toggleMenu()}>Contact Us</a>
  </nav>
</header>

<main>
  <!-- Carousel Section -->
  <section class="carousel-section">
    <div class="carousel-container">
      <Splide
        options={{
          autoplay: true,
          interval: 4000, // Faster rotation (4 seconds)
          speed: 1500,
          pagination: true,
          arrows: true,
          type: "loop",
          perPage: 3,
          focus: "center",
          width: "100%",
          gap: "10px",
          padding: { left: "10%", right: "10%" },
          cover: false,
          breakpoints: {
            768: {
              perPage: 1,
              gap: "0px",
              padding: 0,
            },
            480: {
              perPage: 1,
              gap: "0px",
              padding: 0,
            },
          },
        }}
      >
        {#each carouselImages as image, index}
          <SplideSlide>
            <div
              class="slide-content"
              on:click={() => toggleCarouselPopUp(index)}
              role="button"
              aria-label={`View larger image of project ${index + 1}`}
              tabindex="0"
              on:keydown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  toggleCarouselPopUp(index);
                }
              }}
            >
              <img src={image} alt="Tiny Home Project" class="carousel-image" />
            </div>
          </SplideSlide>
        {/each}
      </Splide>
    </div>
  </section>

  <!-- CTA (Start Small) Section -->
  <section class="cta-section">
    <div class="panel">
      <h2><span class="start">start</span> <span class="small">small</span></h2>
      <div class="buttons">
        <button class="cta-button" on:click={() => (popUpType = "live")}>
          <img src="/assets/images/icons/live-icon.png" alt="Live" />
          <span>live</span>
        </button>
        <button class="cta-button" on:click={() => (popUpType = "travel")}>
          <img src="/assets/images/icons/travel-icon.png" alt="Travel" />
          <span>travel</span>
        </button>
        <button class="cta-button" on:click={() => (popUpType = "invest")}>
          <img src="/assets/images/icons/invest-icon.png" alt="Invest" />
          <span>invest</span>
        </button>
      </div>
    </div>
  </section>

  {#if popUpType}
    <PopUpForm type={popUpType} onClose={() => (popUpType = null)} />
  {/if}

  {#if carouselPopUp}
    <PopUpCarousel
      images={carouselImages}
      startIndex={currentSlideIndex}
      onClose={() => (carouselPopUp = false)}
    />
  {/if}
</main>

<footer>
  <div
    class="privacy-policy-link"
    role="button"
    tabindex="0"
    on:click={() => (isDrawerOpen = !isDrawerOpen)}
    on:keydown={(e) => {
      if (e.key === "Enter" || e.key === " ") isDrawerOpen = !isDrawerOpen;
    }}
  >
    Privacy Policy
  </div>
</footer>

{#if isDrawerOpen}
  <div class="privacy-policy-drawer" class:open={isDrawerOpen}>
    <button class="close-btn" on:click={() => (isDrawerOpen = false)}>X</button>
    <div class="drawer-text">{privacyPolicyText}</div>
  </div>
{/if}

<style>
  /* General Layout */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Header styles */
  header {
    background-color: #d8d6d2;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    height: 60px;
  }

  .logo {
    font-family: "League Script", cursive;
    font-size: 3.5rem;
    font-weight: 100;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    text-decoration: none;
    color: #3f3f3f;
    position: absolute;
    top: 60%;
    left: 40px;
    transform: translate(0, -50%);
  }

  .hamburger {
    font-size: 1.5rem;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    display: block;
    color: #3f3f3f;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    z-index: 1001;
  }

  nav {
    display: flex;
    gap: 1rem;
    background-color: #d8d6d2;
    position: absolute;
    top: 60px;
    width: 100%;
    padding: 1rem;
    flex-direction: row;
    justify-content: space-evenly;
    transition: right 0.3s ease-in-out;
    right: -100%; /* Default closed position for desktop */
    visibility: hidden; /* Hide by default on desktop when closed */
  }

  nav.is-open {
    right: 0; /* Open position for desktop */
    visibility: visible; /* Show when open on desktop */
  }

  @media (max-width: 768px) {
    nav {
      flex-direction: column;
      align-items: center;
      top: 60px;
      left: 0;
      width: 100%;
      padding: 1rem;
      transition: top 0.3s ease-in-out;
      top: -400px; /* Adjusted to collapse fully off-screen on mobile */
      background-color: #d8d6d2; /* Ensure background is visible */
      visibility: hidden; /* Hide by default on mobile when closed */
    }

    nav.is-open {
      top: 60px; /* Open position for mobile */
      visibility: visible; /* Show when open on mobile */
    }
  }

  nav a {
    color: #3f3f3f;
    font-size: 1.2rem;
    text-decoration: none;
  }

  nav a:hover {
    text-decoration: underline;
  }

  /* Main content styles */
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding-top: 60px;
    padding-bottom: 20px; /* Space for fixed footer */
    background-color: #f1f1ef;
  }

  /* Carousel Section */
  .carousel-section {
    width: 100%;
    padding: 0;
    margin: 0 auto;
  }

  .carousel-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    overflow: hidden;
    max-height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Default styles for all slides */
  :global(.splide__slide) {
    opacity: 0.6; /* Side slides are less opaque */
    transition:
      transform 0.5s ease,
      opacity 0s; /* Instant opacity change, smooth transform */
  }

  /* Active slide (center) */
  :global(.splide__slide.is-active) {
    opacity: 1; /* Featured slide is fully opaque */
    z-index: 10; /* Ensure it’s above other slides */
  }

  /* Slide content (applies to all slides) */
  .slide-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transform: scale(0.7); /* Smaller size for side slides */
    transition: transform 0s; /* Instant transform change for entering center */
    cursor: pointer; /* Indicate clickable */
  }

  /* Active slide content (center only) */
  :global(.splide__slide.is-active .slide-content) {
    transform: scale(1); /* Larger size for featured slide */
    transition: transform 0s; /* Instant transform change for entering center */
  }

  /* Image styling */
  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Ensures images fit containers without distortion */
  }

  /* Splide Arrows (matching design) */
  :global(.splide__arrow) {
    background: #3f3f3f;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    opacity: 0.7;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  :global(.splide__arrow:hover) {
    opacity: 1;
    transform: scale(1.1);
  }

  :global(.splide__arrow:focus) {
    outline: none; /* Removed blue focus ring */
  }

  :global(.splide__arrow--prev) {
    left: 10px;
  }

  :global(.splide__arrow--next) {
    right: 10px;
  }

  /* CTA (Start Small) Section */
  .cta-section {
    width: 100%;
    padding: 20px 0;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 60px - 400px - 40px);
  }

  .panel {
    background-color: #d8d6d2;
    border-radius: 10px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 1200px;
    width: 90%;
    margin-bottom: 2rem;
  }

  .panel h2 {
    font-size: 3rem;
    margin-bottom: 2rem;
    color: #3f3f3f;
  }

  .start {
    font-family: "Josefin Sans", sans-serif;
    font-weight: 200;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    color: #3f3f3f;
  }

  .small {
    font-family: "Yellowtail", cursive;
    font-weight: 200;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    color: #3f3f3f;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  /* Enhanced Button Styles */
  button.cta-button {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 180px;
    height: 180px;
    min-height: 180px;
    position: relative;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  button.cta-button:hover {
    background-color: #f5f5f5;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    transform: scale(1.05) rotate(2deg);
  }

  button.cta-button:active {
    transform: scale(0.98) rotate(-2deg);
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-5px);
    }
    60% {
      transform: translateY(-3px);
    }
  }

  button.cta-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px #007bff;
    animation: bounce 0.5s ease;
  }

  button.cta-button img {
    width: 130px;
    height: 130px;
    margin: 0 auto;
    object-fit: contain;
    display: block;
    position: absolute;
    bottom: calc(0.1rem + 2.25rem + 0.2rem);
    left: 50%;
    transform: translateX(-50%);
  }

  button.cta-button span {
    font-family: "Josefin Sans", sans-serif;
    font-size: 2.25rem;
    font-weight: normal;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    color: #3f3f3f;
    position: absolute;
    bottom: 0.1rem;
    width: 100%;
    text-align: center;
  }

  /* Footer and Privacy Policy Drawer */
  footer {
    height: 20px;
    background-color: #d8d6d2;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .privacy-policy-link {
    font-size: 0.5rem;
    color: #5f5f5f;
    cursor: pointer;
  }

  .privacy-policy-drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15vh; /* Reduced to 25% of viewport height */
    background-color: #d8d6d2;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1001;
    overflow-y: auto;
  }

  .privacy-policy-drawer.open {
    transform: translateY(0);
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: #5f5f5f;
  }

  .drawer-text {
    padding: 20px;
    font-size: 0.5em; /* Default size for readability */
    color: #5f5f5f;
    text-align: center;
  }

  /* Responsive font sizes for drawer text */
  @media (max-width: 600px) {
    .drawer-text {
      font-size: 0.5em; /* Larger on small screens (e.g., mobile phones) */
    }
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    .drawer-text {
      font-size: 0.5em; /* Slightly larger on medium screens (e.g., tablets) */
    }
  }

  @media (min-width: 1025px) {
    .drawer-text {
      font-size: 0.5em; /* Default size for large screens (e.g., desktops) */
    }
  }

  /* Responsive Design for Other Elements */
  @media (max-width: 768px) {
    .hamburger {
      display: block;
    }
    .carousel-container {
      max-width: 90%;
    }
    :global(.splide__slide) {
      opacity: 1;
    }
    .slide-content {
      transform: scale(1);
    }
    :global(.splide__slide.is-active .slide-content) {
      transform: scale(1);
    }
    .cta-section {
      padding: 10px 0;
    }
    .buttons {
      flex-direction: column;
      align-items: center;
    }
    button.cta-button {
      width: 200px;
      height: 200px;
      min-height: 200px;
    }
    :global(.splide__arrow) {
      width: 30px;
      height: 30px;
      font-size: 1.2rem;
    }
  }

  @media (max-width: 480px) {
    .carousel-container {
      max-width: 85%;
    }
    .cta-section {
      padding: 5px 0;
    }
    .panel {
      width: 80%;
      padding: 1.5rem;
    }
    .panel h2 {
      font-size: 2rem;
    }
    .logo {
      font-size: 3.5rem;
      left: 20px;
    }
    .hamburger {
      right: 20px;
    }
    .buttons {
      gap: 2rem;
    }
    button.cta-button {
      width: 180px;
      height: 180px;
      min-height: 180px;
    }
    :global(.splide__arrow) {
      width: 25px;
      height: 25px;
      font-size: 1rem;
    }
  }
</style>
