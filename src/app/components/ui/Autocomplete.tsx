import { useState, useRef, useEffect, useCallback } from 'react';

interface AutocompleteProps<T> {
  options: T[];
  value: string;
  onChange: (value: string) => void;
  getOptionLabel: (option: T) => string;
  getOptionKey?: (option: T) => string | number;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  required?: boolean;
  className?: string;
}

export function Autocomplete<T>({
  options,
  value,
  onChange,
  getOptionLabel,
  getOptionKey,
  placeholder,
  disabled,
  error,
  id,
  required,
  className,
}: AutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    getOptionLabel(option).toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 20);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  }, [onChange]);

  const handleSelectOption = useCallback((option: T) => {
    const label = getOptionLabel(option);
    setInputValue(label);
    onChange(label);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [getOptionLabel, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [isOpen, highlightedIndex, filteredOptions, handleSelectOption]);

  const handleFocus = useCallback(() => {
    if (filteredOptions.length > 0) {
      setIsOpen(true);
    }
  }, [filteredOptions.length]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        className={className || 'form-input'}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        style={{ borderColor: error ? '#dc3545' : undefined }}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {filteredOptions.map((option, index) => {
            const label = getOptionLabel(option);
            const key = getOptionKey ? getOptionKey(option) : label;
            return (
              <li
                key={key}
                role="option"
                aria-selected={highlightedIndex === index}
                onClick={() => handleSelectOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  backgroundColor: highlightedIndex === index ? '#f0f0f0' : 'white',
                }}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
