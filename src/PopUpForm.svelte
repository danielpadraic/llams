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
    travelTime: "", // Changed from moveInTime for "travel"
    travelComments: "", // Changed from moveInComments for "travel"
    moveInTime: "", // Retained for "live"
    moveInComments: "", // Retained for "live"
    rvUse: "", // New field for "travel"
    budget: "",
    purchaseMethod: "",
    comments: "",
  };

  let dialogElement;

  // Load saved data when the popup mounts
  onMount(() => {
    const savedData = localStorage.getItem(`formData_${type}`);
    if (savedData) {
      formData = JSON.parse(savedData);
    }
    dialogElement.showModal();
  });

  // Save formData to localStorage whenever it changes
  $: {
    localStorage.setItem(`formData_${type}`, JSON.stringify(formData));
  }

  function handleSubmit() {
    console.log("Form submitted:", formData);
    formData = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      cityStateZip: "",
      lookingFor: "",
      travelTime: "",
      travelComments: "",
      moveInTime: "",
      moveInComments: "",
      rvUse: "",
      budget: "",
      purchaseMethod: "",
      comments: "",
    };
    localStorage.removeItem(`formData_${type}`);
    dialogElement.close();
    onClose();
  }

  // Handle closing via overlay click (backdrop)
  function handleOverlayClick(event) {
    if (event.target === dialogElement) {
      dialogElement.close();
      onClose();
    }
  }

  // Optional: Clear localStorage on page exit (uncomment if desired)
  onDestroy(() => {
    // localStorage.removeItem(`formData_${type}`);
  });
</script>

<!-- Dialog element for the popup -->
<dialog
  class="popup-overlay"
  bind:this={dialogElement}
  on:click={handleOverlayClick}
  on:cancel={() => {
    dialogElement.close();
    onClose();
  }}
>
  <!-- Content container (non-interactive) -->
  <div class="popup-content">
    <button
      class="close-btn"
      on:click={() => {
        dialogElement.close();
        onClose();
      }}>×</button
    >

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
        Home RVs offer luxury and comfort, whether you’re parked in bustling
        Manhattan or high up in the Rocky Mountains, you'll never have to
        sacrifice luxury for affordability again. . .
      </p>
      <h3>I want to travel in a tiny home</h3>
    {:else if type === "invest"}
      <p>
        Whether you have several acres, or just a spare driveway, investing in
        Tiny Home properties can accommodate any investor appetite or budget.
        Start with a single unit or create an entire Tiny village to generate
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

      {#if type === "live"}
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
      {:else if type === "travel"}
        <label>
          When are you looking to travel in your Tiny Home RV?
          <select bind:value={formData.travelTime} required>
            <option value="">Select an option</option>
            <option value="yesterday">Yesterday</option>
            <option value="1-6months">1-6 Months</option>
            <option value="withinYear">Within a year</option>
            <option value="sometime">Other (Please specify...)</option>
          </select>
        </label>
        {#if formData.travelTime === "sometime"}
          <label>
            Comments on travel time:
            <textarea bind:value={formData.travelComments}></textarea>
          </label>
        {/if}
        <label>
          How do you intend to use your Tiny Home RV?
          <select bind:value={formData.rvUse} required>
            <option value="">Select an option</option>
            <option value="dryCamping">Dry Camping/Boondocking</option>
            <option value="hookups">With Hookups (RV Park/Campgrounds)</option>
          </select>
        </label>
      {/if}

      {#if type === "live" || type === "travel"}
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
      {/if}

      <label>
        Comments:
        <textarea bind:value={formData.comments}></textarea>
      </label>
      <button type="submit">Submit</button>
    </form>
  </div>
</dialog>

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
    border: none;
    padding: 0;
    margin: 0;
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
