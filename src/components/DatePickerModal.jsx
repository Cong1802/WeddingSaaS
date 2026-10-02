import React, { useState, useEffect } from 'react';

export default function DatePickerModal({
  isOpen,
  onClose,
  currentDateStr,
  onSelectDate
}) {
  // Parse initial date from string "20 . 09 . 2026" or "YYYY-MM-DD"
  const parseInitialDate = (str) => {
    if (!str) return { year: 2026, month: 9, day: 20 };
    if (str.includes('-')) {
      const parts = str.split('-').map(Number);
      if (parts.length === 3) return { year: parts[0], month: parts[1], day: parts[2] };
    }
    const nums = str.split('.').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (nums.length === 3) {
      if (nums[0] > 1000) return { year: nums[0], month: nums[1], day: nums[2] };
      return { day: nums[0], month: nums[1], year: nums[2] };
    }
    return { year: 2026, month: 9, day: 20 };
  };

  const initial = parseInitialDate(currentDateStr);
  const [selectedYear, setSelectedYear] = useState(initial.year);
  const [selectedMonth, setSelectedMonth] = useState(initial.month); // 1-12
  const [selectedDay, setSelectedDay] = useState(initial.day);

  useEffect(() => {
    if (isOpen) {
      const parsed = parseInitialDate(currentDateStr);
      setSelectedYear(parsed.year);
      setSelectedMonth(parsed.month);
      setSelectedDay(parsed.day);
    }
  }, [isOpen, currentDateStr]);

  if (!isOpen) return null;

  // Helper to trigger live update to parent state & iframe preview
  const notifySelectDate = (year, month, day) => {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    const formattedDate = `${dayStr} . ${monthStr} . ${year}`;
    if (onSelectDate) {
      onSelectDate(formattedDate);
    }
  };

  const handleDayClick = (d) => {
    setSelectedDay(d);
    notifySelectDate(selectedYear, selectedMonth, d);
  };

  const handlePrevMonth = () => {
    let newM = selectedMonth - 1;
    let newY = selectedYear;
    if (newM < 1) {
      newM = 12;
      newY -= 1;
    }
    setSelectedMonth(newM);
    setSelectedYear(newY);
    notifySelectDate(newY, newM, selectedDay);
  };

  const handleNextMonth = () => {
    let newM = selectedMonth + 1;
    let newY = selectedYear;
    if (newM > 12) {
      newM = 1;
      newY += 1;
    }
    setSelectedMonth(newM);
    setSelectedYear(newY);
    notifySelectDate(newY, newM, selectedDay);
  };

  const handleYearChange = (newY) => {
    setSelectedYear(newY);
    notifySelectDate(newY, selectedMonth, selectedDay);
  };

  // Calculate calendar grid (T2..CN = Mon..Sun)
  const firstDayObj = new Date(selectedYear, selectedMonth - 1, 1);
  let startCol = firstDayObj.getDay(); // 0=Sun, 1=Mon...
  startCol = (startCol === 0) ? 6 : startCol - 1; // 0=Mon, 6=Sun

  const totalDays = new Date(selectedYear, selectedMonth, 0).getDate();

  const gridCells = [];
  for (let i = 0; i < startCol; i++) {
    gridCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    gridCells.push(d);
  }

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  return (
    <div 
      className="app-modal-overlay animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        cursor: 'pointer'
      }}
    >
      <div 
        className="app-modal-container"
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#FCFBF7',
          width: '100%',
          maxWidth: '380px',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 2px #D4AF37',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Playfair Display', Georgia, serif",
          cursor: 'default'
        }}
      >
        {/* Mobile Drag Handle */}
        <div className="mobile-only" style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(212, 175, 55, 0.6)', margin: '8px auto 4px auto', flexShrink: 0 }} />
        {/* Header Ribbon - Wedding Royal Crimson & Gold Theme */}
        <div style={{
          background: 'linear-gradient(135deg, #7D0101 0%, #991b1b 50%, #6b0101 100%)',
          padding: '22px 24px 18px',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative',
          borderBottom: '2px solid #D4AF37'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              color: '#ffffff',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            ✕
          </button>
          <div style={{ fontSize: '26px', marginBottom: '2px' }}>💍</div>
          <h3 style={{
            margin: 0,
            fontSize: '19px',
            fontWeight: '700',
            letterSpacing: '1px',
            color: '#FEF08A',
            textTransform: 'uppercase'
          }}>
            CHỌN NGÀY THÀNH HÔN
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.9, color: '#fef3c7', fontFamily: 'sans-serif' }}>
            Lựa chọn ngày lành tháng tốt cho lễ cưới
          </p>
        </div>

        {/* Body Content */}
        <div style={{ padding: '20px 24px 16px', fontFamily: 'sans-serif' }}>
          {/* Month / Year Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            backgroundColor: '#F5EFE6',
            padding: '8px 14px',
            borderRadius: '16px',
            border: '1px solid #E6DCCF'
          }}>
            <button
              onClick={handlePrevMonth}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                border: '1px solid #D4AF37',
                backgroundColor: '#7D0101',
                color: '#FEF08A',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(125,1,1,0.2)'
              }}
            >
              ❮
            </button>

            <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#7D0101',
                fontFamily: "'Playfair Display', serif"
              }}>
                {monthNames[selectedMonth - 1]}
              </span>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                style={{
                  border: '1px solid #D4AF37',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '2px 6px',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#7D0101',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {[2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNextMonth}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                border: '1px solid #D4AF37',
                backgroundColor: '#7D0101',
                color: '#FEF08A',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(125,1,1,0.2)'
              }}
            >
              ❯
            </button>
          </div>

          {/* Days of Week Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            marginBottom: '10px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#7D0101',
            letterSpacing: '0.5px'
          }}>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span style={{ color: '#DC2626' }}>CN</span>
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px',
            textAlign: 'center'
          }}>
            {gridCells.map((dayNum, index) => {
              if (!dayNum) {
                return <div key={`empty-${index}`} style={{ height: '38px' }} />;
              }

              const isSelected = (dayNum === selectedDay);

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => handleDayClick(dayNum)}
                  style={{
                    height: '38px',
                    borderRadius: '50%',
                    border: isSelected ? '2px solid #D4AF37' : '1px solid #E8E2D7',
                    background: isSelected 
                      ? 'linear-gradient(135deg, #7D0101 0%, #991b1b 100%)' 
                      : '#F9F6F0',
                    color: isSelected ? '#ffffff' : '#333333',
                    fontWeight: isSelected ? '700' : '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 0 3px rgba(212, 175, 55, 0.35), 0 4px 14px rgba(125, 1, 1, 0.4)' : 'none'
                  }}
                >
                  {dayNum}
                  {isSelected && (
                    <span style={{
                      position: 'absolute',
                      bottom: '-3px',
                      fontSize: '9px'
                    }}>
                      ❤️
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '14px 24px 20px',
          display: 'flex',
          gap: '12px',
          backgroundColor: '#F5EFE6',
          borderTop: '1px solid #E6DCCF',
          fontFamily: 'sans-serif'
        }}>
          <button
            onClick={() => {
              const now = new Date();
              setSelectedYear(now.getFullYear());
              setSelectedMonth(now.getMonth() + 1);
              setSelectedDay(now.getDate());
              notifySelectDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
            }}
            style={{
              padding: '12px 18px',
              borderRadius: '14px',
              border: '1px solid #7D0101',
              backgroundColor: '#FAF7F2',
              color: '#7D0101',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Hôm nay
          </button>

          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              border: '1.5px solid #D4AF37',
              background: 'linear-gradient(135deg, #7D0101 0%, #991b1b 100%)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(125, 1, 1, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            ✨ Hoàn Tất & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
