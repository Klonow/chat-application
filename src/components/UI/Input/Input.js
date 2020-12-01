import React from 'react'

export const Input = props => {
  const { placeholder, name, type, onChange, value, reference, className, id} = props
  return (
    <div className={className}>
      <label htmlFor={name}>{placeholder}</label>
      <input
        value={value}
        onChange={(event) => onChange(event)}
        type={type}
        id={id}
        name={name}
        ref={reference}
        required="required"
      />
    </div>
  )
}
