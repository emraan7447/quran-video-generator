export default function Dropdown({ label, options, value, onChange }) {
  return (
    <label>{label}
      <select value={value} onChange={onChange}>
        {options.map((opt,i)=><option key={i}>{opt}</option>)}
      </select>
    </label>
  );
}
