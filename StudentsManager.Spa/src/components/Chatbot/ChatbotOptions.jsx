function ChatbotOptions({ options, onSelect }) {
    const countClass = options.length <= 3 ? `btn-${options.length}` : 'btn-n';

    return (
        <div className={`soge-btn-wrapper ${countClass}`}>
            {options.map((opt, i) => (
                <button key={i} type="button" className="soge-btn" onClick={() => onSelect(opt.text)}>
                    {opt.text}
                </button>
            ))}
        </div>
    );
}

export default ChatbotOptions;
