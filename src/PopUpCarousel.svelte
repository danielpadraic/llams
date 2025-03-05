<script>
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import "@splidejs/svelte-splide/css";
  import { onMount, onDestroy } from "svelte";

  export let images; // Array of image paths
  export let startIndex = 0; // Index of the image to start with
  export let onClose; // Function to close the pop-up

  let currentIndex = startIndex;
  let splide;

  // Handle closing with keyboard (Escape key)
  function handleKeydown(event) {
    if (event.key === "Escape") {
      onClose();
    } else if (event.key === "ArrowLeft") {
      splide?.go("<");
    } else if (event.key === "ArrowRight") {
      splide?.go(">");
    }
  }

  // Handle clicking the overlay to close (but not the content area)
  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  // Mount and unmount event listeners for keyboard accessibility
  onMount(() => {
    document.addEventListener("keydown", handleKeydown);
    splide = new Splide(".splide", {
      autoplay: true, // Enable auto-play to match App.svelte
      interval: 4000, // Match App.svelte's faster rotation
      speed: 500, // Reduced to 500ms for quicker transitions
      pagination: false, // No pagination for single image view
      arrows: true,
      type: "loop",
      perPage: 1,
      focus: "center",
      width: "100%", // Full width for nearly full-screen
      maxWidth: "1200px",
      height: "90vh", // Nearly full-screen height
      gap: "0",
      padding: 0,
      cover: true, // Ensure image fills the container
      start: startIndex, // Start at the clicked image
    }).mount();
  });

  onDestroy(() => {
    document.removeEventListener("keydown", handleKeydown);
    if (splide) {
      splide.destroy(); // Clean up Splide instance
    }
  });

  // Function to update current index when slide changes (for accessibility)
  function onSlideChange(splideInstance) {
    currentIndex = splideInstance.index;
  }
</script>

<div
  class="popup-overlay"
  on:click={handleOverlayClick}
  role="dialog"
  aria-label="Expanded image popup"
  tabindex="0"
  on:keydown={handleKeydown}
>
  <div class="popup-content" role="document">
    <Splide
      class="splide"
      options={{
        autoplay: true,
        interval: 4000,
        speed: 500, // Reduced to 500ms for quicker transitions
        pagination: false,
        arrows: true,
        type: "loop",
        perPage: 1,
        focus: "center",
        width: "100%",
        maxWidth: "1200px",
        height: "90vh",
        gap: "0",
        padding: 0,
        cover: true,
        start: startIndex,
      }}
      on:move={(event) => onSlideChange(event.detail)}
      bind:this={splide}
    >
      {#each images as image, index}
        <SplideSlide>
          <div class="slide-content">
            <img
              src={image}
              alt={`Tiny Home Project ${index + 1} (Expanded)`}
              class="carousel-image"
            />
          </div>
        </SplideSlide>
      {/each}
    </Splide>
  </div>
</div>

<style>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1002; /* Above header (1000) and lead pop-up (1001) */
  }

  .popup-content {
    background: #fff;
    padding: 1rem;
    border-radius: 10px;
    width: 100%; /* Full width for nearly full-screen */
    max-width: 1200px;
    height: 90vh; /* Nearly full-screen height */
    position: relative;
    font-family: "Josefin Sans", sans-serif;
    color: #3f3f3f;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slide-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Ensures images fit and enlarge properly without distortion */
  }

  /* Splide Arrows (matching App.svelte design) */
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
    /* Optionally, you can add a different focus style or none at all */
  }

  :global(.splide__arrow--prev) {
    left: 10px;
  }

  :global(.splide__arrow--next) {
    right: 10px;
  }

  /* Responsive adjustments for pop-up */
  @media (max-width: 768px) {
    .popup-content {
      width: 90%; /* Slightly smaller on tablets, still clickable off */
      height: 80vh;
    }
    :global(.splide__arrow) {
      width: 30px;
      height: 30px;
      font-size: 1.2rem;
    }
  }

  @media (max-width: 480px) {
    .popup-content {
      width: 90%; /* Slightly smaller on mobile, clickable off as before */
      height: 70vh;
    }
    :global(.splide__arrow) {
      width: 25px;
      height: 25px;
      font-size: 1rem;
    }
  }
</style>
