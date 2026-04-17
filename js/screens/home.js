// ═══ SCREEN: HOME ═══

Screens.home = function() {
    const wt = 33600, wtg = 55000, pct = Math.round(wt/wtg*100);
    const days = [
      {d:'Пн', done:true}, {d:'Вт', rest:true}, {d:'Ср', done:true},
      {d:'Чт', rest:true}, {d:'Пт', today:true}, {d:'Сб'}, {d:'Вс', rest:true},
    ];

    let html = '<span class="lbl">СЕГОДНЯ · ПЯТНИЦА</span>';
    html += '<div class="ttl" style="margin-bottom:4px;font-size:34px">Привет, Макс 👊</div>';
    html += '<div style="font-size:12px;color:var(--sb);margin-bottom:20px">День A — тяжёлый</div>';
    html += '<div style="display:flex;gap:8px;margin-bottom:16px">';
    html += '<button onclick="App.nav(\'workout\')" style="flex:2;background:var(--sf);border:1px solid var(--br2);border-top:1px solid #3a3b3e;border-radius:12px;padding:14px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:10px">';
    html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2" stroke-linecap="round"><path d="M6 4v6M6 14v6M18 4v6M18 14v6M2 9h4M14 9h4M2 15h4M14 15h4M10 9v6"/></svg>';
    html += '<div style="text-align:left"><div style="font-size:11px;font-weight:700;color:var(--tx2)">Открыть дневник</div><div style="font-size:10px;color:var(--sb)">День A сегодня</div></div>';
    html += '</button>';
    html += '<button onclick="App.nav(\'programs\')" style="flex:1;background:var(--sf);border:1px solid var(--br2);border-top:1px solid #3a3b3e;border-radius:12px;padding:14px;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:4px">';
    html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sb)" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/></svg>';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:1px">ПРОГРАММЫ</div>';
    html += '</button>';
    html += '</div>';

    html += '<div class="card">';
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">';
    html += '<div><span class="lbl">ТОННАЖ НЕДЕЛИ</span><div style="font-size:28px;font-weight:700;color:var(--ac)">' + (wt/1000).toFixed(1) + '<span style="font-size:13px;color:#A0A2A8">т</span></div></div>';
    html += '<div style="text-align:right"><span class="lbl">ЦЕЛЬ</span><div style="font-size:16px;color:var(--mt)">' + (wtg/1000).toFixed(0) + 'т</div><div style="font-size:11px;color:#7ab830">' + pct + '%</div></div>';
    html += '</div>';
    html += '<div class="pbar" style="margin-bottom:12px"><div class="pfil" style="width:' + pct + '%"></div></div>';
    html += '<div class="wgrid">';
    days.forEach(d => {
      const bg  = d.today ? 'rgba(200,255,0,.1)' : d.done ? '#1e1e20' : '#111';
      const bc  = d.today ? 'rgba(200,255,0,.4)' : 'var(--br)';
      const col = d.today ? 'var(--ac)' : d.done ? 'var(--accent-secondary)' : 'var(--mt)';
      const icon = d.rest ? '💤' : d.today ? '▶' : d.done ? '✓' : '';
      html += '<div class="wday"><div class="wblock" style="background:' + bg + ';border-color:' + bc + ';color:' + col + '">' + icon + '</div>';
      html += '<span style="font-size:9px;color:' + (d.today ? 'var(--ac)' : 'var(--mt)') + '">' + d.d + '</span></div>';
    });
    html += '</div></div>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">';
    [{l:'ПОСЛЕДНЯЯ',v:'3 дня',u:'назад'},{l:'ДО ЦЕЛИ',v:'67%',u:'до 130кг жим'},{l:'ТРЕНИРОВОК',v:'142',u:'за всё время'},{l:'СЛЕД. ДЕНЬ',v:'Пятница',u:'День A'}].forEach(s => {
      html += '<div class="card-sm"><span class="lbl">' + s.l + '</span><div style="font-size:22px;font-weight:700">' + s.v + '</div><div style="font-size:10px;color:var(--sb)">' + s.u + '</div></div>';
    });
    html += '</div>';

    html += '<div style="background:#171819;border:1px solid #2a2b2e;border-radius:12px;padding:14px">';
    html += '<span class="lbl" style="color:#9EAA8C">◈ ИИ-ТРЕНЕР</span>';
    html += '<div style="font-size:13px;color:#C8CACC;line-height:1.7">Жим растёт быстрее плана (+5кг/мес). Рекомендую добавить подход на следующей неделе.</div>';
    html += '</div>';
    return html;
};

