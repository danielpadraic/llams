<script>
  import { onMount, onDestroy } from "svelte";
  import { supabase } from "./supabase"; // Import the shared client

  export let type;
  export let onClose;

  // Initialize formData with default valid values where possible to prevent empty strings
  let formData = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    cityStateZip: "",
    lookingFor: "myself", // Default to a valid value
    travelTime: "yesterday", // Default to a valid value
    travelComments: "",
    moveInTime: "yesterday", // Default to a valid value
    moveInComments: "",
    unitCount: "1", // Default to a valid value
    rentalStartTime: "yesterday", // Default to a valid value
    rentalStartComments: "",
    hasLand: "yes", // Default to a valid value
    needsLandHelp: "yes", // Default to a valid value
    budget: "under70k", // Default to a valid value
    purchaseMethod: "cash", // Default to a valid value
    comments: "",
    preferredContact: "call", // Default to a valid value
  };

  let dialogElement;

  onMount(() => {
    const savedData = localStorage.getItem(`formData_${type}`);
    if (savedData) {
      formData = JSON.parse(savedData);
    }
    dialogElement.showModal();
  });

  $: {
    localStorage.setItem(`formData_${type}`, JSON.stringify(formData));
  }

  async function handleSubmit() {
    // Prepare the data to send to the Edge Function
    const leadData = {
      type: type,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      city_state_zip: formData.cityStateZip,
      looking_for: formData.lookingFor || "myself", // Ensure a valid value
      budget: formData.budget || "under70k", // Ensure a valid value
      comments: formData.comments || null,
      preferred_contact: formData.preferredContact || "call", // Ensure a valid value
      move_in_time: type === "live" ? formData.moveInTime || "yesterday" : null, // Ensure a valid value
      move_in_comments:
        type === "live" ? formData.moveInComments || null : null,
      travel_time:
        type === "travel" ? formData.travelTime || "yesterday" : null, // Ensure a valid value
      travel_comments:
        type === "travel" ? formData.travelComments || null : null,
      rv_use: type === "travel" ? formData.rvUse || "dryCamping" : null, // Ensure a valid value
      unit_count: type === "invest" ? formData.unitCount || "1" : null, // Ensure a valid value
      rental_start_time:
        type === "invest" ? formData.rentalStartTime || "yesterday" : null, // Ensure a valid value
      rental_start_comments:
        type === "invest" ? formData.rentalStartComments || null : null,
      has_land: type === "invest" ? formData.hasLand || "yes" : null, // Ensure a valid value
      needs_land_help:
        type === "invest" && formData.hasLand === "no"
          ? formData.needsLandHelp || "yes"
          : null, // Ensure a valid value
      purchase_method:
        type === "live" || type === "travel"
          ? formData.purchaseMethod || "cash"
          : null, // Ensure a valid value
    };

    // Call the submit-lead Edge Function
    try {
      const response = await fetch(
        "https://pxxccofroamhafrxigox.supabase.co/functions/v1/submit-lead",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(leadData),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        console.error(
          "Error submitting lead:",
          result.error || response.statusText
        );
        return;
      }

      console.log("Lead submitted successfully:", leadData);

      // Reset form and close
      formData = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        cityStateZip: "",
        lookingFor: "myself",
        travelTime: "yesterday",
        travelComments: "",
        moveInTime: "yesterday",
        moveInComments: "",
        unitCount: "1",
        rentalStartTime: "yesterday",
        rentalStartComments: "",
        hasLand: "yes",
        needsLandHelp: "yes",
        budget: "under70k",
        purchaseMethod: "cash",
        comments: "",
        preferredContact: "call",
      };
      localStorage.removeItem(`formData_${type}`);
      dialogElement.close();
      onClose();
    } catch (error) {
      console.error("Error submitting lead:", error);
    }
  }

  function handleOverlayClick(event) {
    if (event.target === dialogElement) {
      dialogElement.close();
      onClose();
    }
  }

  onDestroy(() => {
    // Optional: Uncomment to clear localStorage on destroy
    // localStorage.removeItem(`formData_${type}`);
  });
</script>

<dialog
  class="popup-overlay"
  bind:this={dialogElement}
  on:click={handleOverlayClick}
  on:cancel={() => {
    dialogElement.close();
    onClose();
  }}
>
  <div class="popup-content">
    <button
      class="close-btn"
      on:click={() => {
        dialogElement.close();
        onClose();
      }}
    >
      ×
    </button>

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
        Homes RVs offer luxury and comfort, whether you’re parked in bustling
        Manhattan or high up in the Rocky Mountains, you'll never have to
        sacrifice luxury for affordability again. . .
      </p>
      <h3>I want to travel in a tiny home:</h3>
    {:else if type === "invest"}
      <p>
        Whether you have several acres, or just a spare driveway, investing in
        Tiny Home properties can accommodate any investor appetite or budget.
        Start with a single unit or create an entire Tiny village to generate
        steady, passive income while delivering affordable housing to
        communities in need.
      </p>
      <h3>I want to invest in tiny homes:</h3>
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
          <option value="myself">For myself</option>
          <option value="someoneElse">For someone else</option>
        </select>
      </label>

      {#if type === "live"}
        <label>
          When are you looking to move into your Tiny Home?
          <select bind:value={formData.moveInTime} required>
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
            <option value="dryCamping">Dry Camping/Boondocking</option>
            <option value="hookups">With Hookups (RV Park/Campgrounds)</option>
          </select>
        </label>
      {:else if type === "invest"}
        <label>
          How many units are you looking to build?
          <select bind:value={formData.unitCount} required>
            <option value="1">1</option>
            <option value="2-5">2-5</option>
            <option value="6-10">6-10</option>
            <option value="11-50">11-50</option>
            <option value="51+">51+</option>
          </select>
        </label>
        <label>
          When are you looking to begin leasing/selling your Tiny Home(s)?
          <select bind:value={formData.rentalStartTime} required>
            <option value="yesterday">Yesterday</option>
            <option value="1-6months">1-6 Months</option>
            <option value="withinYear">Within a year</option>
            <option value="sometime">Other (Please specify...)</option>
          </select>
        </label>
        {#if formData.rentalStartTime === "sometime"}
          <label>
            Comments on rental start time:
            <textarea bind:value={formData.rentalStartComments}></textarea>
          </label>
        {/if}
        <label>
          Do you already have land?
          <select bind:value={formData.hasLand} required>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        {#if formData.hasLand === "no"}
          <label>
            Would you like help finding land for an investment property or Tiny
            Home Village?
            <select bind:value={formData.needsLandHelp} required>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        {/if}
      {/if}

      {#if type === "live" || type === "travel" || type === "invest"}
        <label>
          {#if type === "invest"}
            What is your budget (per unit)?
          {:else}
            What is your budget?
          {/if}
          <select bind:value={formData.budget} required>
            <option value="under70k">{@html "<$70,000 (bare bones)"}</option>
            <option value="70k-100k">$70,000-$100,000 (eco-luxury)</option>
            <option value="over100k"
              >$100,000+ (all the bells and whistles)</option
            >
          </select>
        </label>
      {/if}

      {#if type === "live" || type === "travel"}
        <label>
          How are you planning to purchase your Tiny Home?
          <select bind:value={formData.purchaseMethod} required>
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

      <fieldset class="contact-method">
        <legend>Preferred Contact Method:</legend>
        <label class="radio-label">
          <input
            type="radio"
            bind:group={formData.preferredContact}
            value="call"
            required
          />
          Call
        </label>
        <label class="radio-label">
          <input
            type="radio"
            bind:group={formData.preferredContact}
            value="text"
          />
          Text
        </label>
        <label class="radio-label">
          <input
            type="radio"
            bind:group={formData.preferredContact}
            value="email"
          />
          Email
        </label>
      </fieldset>

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

  .contact-method {
    margin-bottom: 1rem;
  }

  .radio-label {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .radio-label input[type="radio"] {
    width: auto;
    margin-right: 0.5rem;
    margin-bottom: 0;
  }
</style>
