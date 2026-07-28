import { useEffect, useState } from 'react'
import emergencyContacts from './emergencyContacts.js'
import { getTrustedContact, saveTrustedContact } from './trustedContact.js'

function BackChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M11.5 3.5L6 9L11.5 14.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 3h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15 15 0 0 1 2.5 4.6 1.5 1.5 0 0 1 4 3Z"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="#fff" strokeWidth="1.4" />
      <path d="M2.5 10h15M10 2.5c2.4 2 2.4 13 0 15M10 2.5c-2.4 2-2.4 13 0 15" stroke="#fff" strokeWidth="1.2" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 18s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 4h14v9H8l-4 3.5V13H3V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrustedContactForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [phone, setPhone] = useState(initial?.phone || '')

  const canSave = name.trim() !== '' && phone.trim() !== ''

  return (
    <div className="sos-modal-backdrop" onClick={onCancel}>
      <div className="sos-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="sos-modal-title">Trusted contact</h2>
        <p className="sos-modal-subtitle">
          Someone you can call quickly in an emergency — a friend, family
          member, or anyone you trust.
        </p>

        <label className="sos-modal-label" htmlFor="trusted-name">
          Name
        </label>
        <input
          id="trusted-name"
          className="sos-modal-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mom"
        />

        <label className="sos-modal-label" htmlFor="trusted-phone">
          Phone number
        </label>
        <input
          id="trusted-phone"
          className="sos-modal-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. +8801234567890"
          type="tel"
        />

        <div className="sos-modal-actions">
          <button className="sos-modal-cancel" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="sos-modal-save"
            type="button"
            disabled={!canSave}
            onClick={() => onSave({ name: name.trim(), phone: phone.trim() })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function SOS({ onBack }) {
  const [trustedContact, setTrustedContact] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    let cancelled = false
    getTrustedContact()
      .then((contact) => {
        if (!cancelled) setTrustedContact(contact)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const handleSaveContact = async (contact) => {
    try {
      await saveTrustedContact(contact)
      setTrustedContact(contact)
    } catch (err) {
      console.error('Failed to save trusted contact:', err)
    }
    setShowForm(false)
  }

  return (
    <div className="sos-screen">
      <button className="sos-back" type="button" onClick={onBack} aria-label="Back">
        <BackChevron />
      </button>

      <div className="sos-label">YOU ARE NOT ALONE</div>
      <h1 className="sos-headline">
        Help is here.
        <br />
        <em>Breathe with me.</em>
      </h1>

      <div className="sos-breathe-card">
        <div className="sos-breathe-circle">
          <span>breathe</span>
        </div>
      </div>

      <div className="sos-contacts">
        {emergencyContacts.map((contact) => (
          <div key={contact.id} className="sos-contact-card">
            <span className="sos-contact-icon" style={{ background: contact.accentColor }}>
              {contact.icon === 'globe' ? <GlobeIcon /> : <PhoneIcon />}
            </span>
            <div className="sos-contact-info">
              <div className="sos-contact-country">
                <span className="sos-contact-code">{contact.countryCode}</span>{' '}
                {contact.countryLabel.toUpperCase()}
              </div>
              <div className="sos-contact-name">{contact.name}</div>
              <div className="sos-contact-detail">{contact.detail}</div>
            </div>
            {contact.actionType === 'call' ? (
              <a
                className="sos-contact-action sos-contact-action-solid"
                style={{ background: contact.accentColor }}
                href={`tel:${contact.phone}`}
              >
                Call
              </a>
            ) : (
              <a
                className="sos-contact-action sos-contact-action-outline"
                href={contact.url}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
            )}
          </div>
        ))}

        {trustedContact && (
          <div className="sos-contact-card">
            <span className="sos-contact-icon" style={{ background: '#8B85D6' }}>
              <PhoneIcon />
            </span>
            <div className="sos-contact-info">
              <div className="sos-contact-country">YOUR TRUSTED CONTACT</div>
              <div className="sos-contact-name">{trustedContact.name}</div>
              <div className="sos-contact-detail">{trustedContact.phone}</div>
            </div>
            <a
              className="sos-contact-action sos-contact-action-solid"
              style={{ background: '#8B85D6' }}
              href={`tel:${trustedContact.phone}`}
            >
              Call
            </a>
          </div>
        )}
      </div>

      <div className="sos-quick-row">
        <a
          className="sos-quick-pill"
          href="https://www.google.com/maps/search/crisis+support+near+me"
          target="_blank"
          rel="noreferrer"
        >
          <PinIcon /> Nearby support
        </a>
        <button className="sos-quick-pill" type="button" onClick={() => setShowForm(true)}>
          <ChatIcon /> {trustedContact ? 'Edit contact' : 'Trusted contact'}
        </button>
      </div>

      {showForm && (
        <TrustedContactForm
          initial={trustedContact}
          onSave={handleSaveContact}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default SOS
