<script>
  import { onMount, onDestroy } from "svelte";

  export let type;
  export let onClose;

  let formData = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    cityStateZip: "",
    lookingFor: "",
    moveInTime: "",
    moveInComments: "",
    budget: "",
    purchaseMethod: "",
    comments: "",
  };

  // Load saved data when the popup mounts
  onMount(() => {
    const savedData = localStorage.getItem(`formData_${type}`);
    if (savedData) {
      formData = JSON.parse(savedData);
    }
  });

  // Save formData to localStorage whenever it changes
  $: {
    localStorage.setItem(`formData_${type}`, JSON.stringify(formData));
  }

  function handleSubmit() {
    console.log("Form submitted:", formData);
    // Clear form and localStorage only on submission
    formData = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      cityStateZip: "",
      lookingFor: "",
      moveInTime: "",
      moveInComments: "",
      budget: "",
      purchaseMethod: "",
      comments: "",
    };
    localStorage.removeItem(`formData_${type}`);
    onClose();
  }

  // Keyboard handler for closing the overlay (e.g., Enter or Space)
  function handleOverlayKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      onClose();
    }
  }

  // Optional: Clear localStorage on page exit (unload)
  onDestroy(() => {
    // Uncomment the line below if you want data cleared on page exit
    // localStorage.removeItem(`formData_${type}`);
  });
</script>

<!-- Overlay as a div with ARIA role and keyboard support -->
<div
  class="popup-overlay"
  role="dialog"
  aria-label="Lead form popup for {type}"
  on:click={onClose}
  on:keydown={handleOverlayKeydown}
  tabindex="0"
>
  <!-- Content with click propagation stopped -->
  <div class="popup-content" on:click|stopPropagation>
    <button class="close-btn" on:click={onClose}>×</button>

    {#if type === "live"}
      <p>
        Whether you're a young professional seeking affordable housing or an
        eco-conscious individual wanting sustainability, our luxury tiny homes
        on wheels provide both. . .
      </p>
      <h3>I want to live in a tiny home:</h3>
    {:else if type === "travel"}
      <p>
        Looking for a way to travel in style and always feel at home? Our Tiny
        Homes on Wheels offer luxury and comfort, whether you’re parked in
        bustling Manhattan or high up in the Rocky Mountains, you'll never have
        to sacrifice luxury for affordability again. . .
      </p>
      <h3>I want to travel in a tiny home</h3>
    {:else if type === "invest"}
      <p>
        Whether you have several acres, or just a spare driveway, investing in
        Tiny Home properties can accomodate any investor appetite or budget.
        Start with a single unit or create an entire Tiny village to generating
        steady, passive income while delivering affordable housing to
        communities in need.
      </p>
      <h3>I want to invest in tiny homes</h3>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <label>
        First Name:
        <input type="text" bind:value={formData.firstName} required />
      </label>
      <label>
        Last Name:
        <input type="text" bind:value={formData.lastName} required />
      </label>
      <label>
        Phone:
        <input type="tel" bind:value={formData.phone} required />
      </label>
      <label>
        Email:
        <input type="email" bind:value={formData.email} required />
      </label>
      <label>
        City/State or Zip:
        <input type="text" bind:value={formData.cityStateZip} required />
      </label>
      <label>
        Are you looking for yourself or someone else?
        <select bind:value={formData.lookingFor} required>
          <option value="">Select an option</option>
          <option value="myself">For myself</option>
          <option value="someoneElse">For someone else</option>
        </select>
      </label>
      <label>
        When are you looking to move into your Tiny Home?
        <select bind:value={formData.moveInTime} required>
          <option value="">Select an option</option>
          <option value="yesterday">Yesterday</option>
          <option value="1-6months">1-6 Months</option>
          <option value="withinYear">Within a year</option>
          <option value="sometime">Other (Please specify...)</option>
        </select>
      </label>
      {#if formData.moveInTime === "sometime"}
        <label>
          Comments on move-in time:
          <textarea bind:value={formData.moveInComments}></textarea>
        </label>
      {/if}
      <label>
        What is your budget?
        <select bind:value={formData.budget} required>
          <option value="">Select an option</option>
          <option value="under70k">{@html "<$70,000 (bare bones)"}</option>
          <option value="70k-100k">$70,000-$100,000 (eco-luxury)</option>
          <option value="over100k"
            >$100,000+ (all the bells and whistles)</option
          >
        </select>
      </label>
      <label>
        How are you planning to purchase your Tiny Home?
        <select bind:value={formData.purchaseMethod} required>
          <option value="">Select an option</option>
          <option value="cash">Cash/Check</option>
          <option value="ownFinancing">I have my own financing</option>
          <option value="needFinancing">I need financing</option>
        </select>
      </label>
      <label>
        Comments:
        <textarea bind:value={formData.comments}></textarea>
      </label>
      <button type="submit">Submit</button>
    </form>
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
    z-index: 1001;
  }

  .popup-content {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    width: 400px;
    position: relative;
    font-family: "Josefin Sans", sans-serif;
    color: #3f3f3f;
    overflow-y: auto;
    max-height: 90vh;
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  p {
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-family: "Josefin Sans", sans-serif;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  button[type="submit"] {
    background: #3f3f3f;
    color: #fff;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
