import { useState } from 'react'


export default function FlagForm({ lab }) {
const [flag, setFlag] = useState('')
const [message, setMessage] = useState('')
const [loading, setLoading] = useState(false)


async function submitFlag() {
if (!flag.trim()) {
setMessage('⚠️ Enter a flag first.')
return
}
setLoading(true)
setMessage('')
try {
const res = await fetch('/api/submit-flag', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ lab, flag })
})
const data = await res.json()
setMessage(data.message || 'Unknown response')
if (data.success) setFlag('')
} catch (e) {
setMessage('❌ Failed to submit flag.')
} finally {
setLoading(false)
}
}


return (
<div>
<h3>Submit Flag</h3>
<input
type="text"
placeholder="Enter flag"
value={flag}
onChange={e => setFlag(e.target.value)}
style={{ padding: 8, minWidth: 280, marginRight: 8 }}
/>
<button onClick={submitFlag} disabled={loading}>
{loading ? 'Submitting...' : 'Submit'}
</button>
{message && <p>{message}</p>}
</div>
)
}