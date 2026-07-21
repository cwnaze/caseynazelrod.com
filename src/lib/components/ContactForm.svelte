<script lang="ts">
	import { contact } from '$lib/data/contact';

	type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let status = $state<SubmitStatus>('idle');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		status = 'submitting';
		try {
			// mode: 'no-cors' is intentional for this placeholder stub — contact.submitUrl
			// doesn't point at a real, CORS-aware backend yet (see data/contact.ts), so a
			// normal-mode fetch would reject with an opaque "Failed to fetch" network error
			// even though the request itself isn't the problem. no-cors resolves as long as
			// the network layer can reach the host at all, which is enough to show a success
			// state for now. Once a real Resend-backed endpoint exists, switch back to the
			// default cors mode and check response.ok instead of assuming success.
			await fetch(contact.submitUrl, {
				method: 'POST',
				mode: 'no-cors',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message })
			});
			status = 'success';
		} catch {
			status = 'error';
		}
	}
</script>

{#if status === 'success'}
	<p class="font-mono text-sm text-green-bright" role="status">
		$ message sent — thanks, {name || 'friend'}. I'll get back to you soon.
	</p>
{:else}
	<form class="max-w-md space-y-4 font-mono text-sm" onsubmit={handleSubmit}>
		<div>
			<label for="contact-name" class="block text-text-muted">Name</label>
			<input
				id="contact-name"
				type="text"
				required
				bind:value={name}
				disabled={status === 'submitting'}
				class="mt-1 w-full border border-green bg-transparent px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
			/>
		</div>

		<div>
			<label for="contact-email" class="block text-text-muted">Email</label>
			<input
				id="contact-email"
				type="email"
				required
				bind:value={email}
				disabled={status === 'submitting'}
				class="mt-1 w-full border border-green bg-transparent px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
			/>
		</div>

		<div>
			<label for="contact-message" class="block text-text-muted">Message</label>
			<textarea
				id="contact-message"
				required
				rows="4"
				bind:value={message}
				disabled={status === 'submitting'}
				class="mt-1 w-full border border-green bg-transparent px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
			></textarea>
		</div>

		<button
			type="submit"
			disabled={status === 'submitting'}
			class="border border-green-bright px-4 py-2 text-green-bright transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
		>
			{status === 'submitting' ? 'Sending…' : 'Send'}
		</button>

		{#if status === 'error'}
			<p class="text-purple" role="alert">
				Something went wrong sending that — please try again in a moment.
			</p>
		{/if}
	</form>
{/if}
