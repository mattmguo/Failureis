function Sticky() {
  return (
    <div className="absolute left-[530px] size-[382px] top-[208px]" data-name="Sticky 6">
      <div className="absolute bg-[#c5dded] left-0 shadow-[0px_2.825px_3.531px_2.825px_rgba(168,168,168,0.25)] size-[382px] top-0" />
      <p className="absolute font-['Lora:Regular',sans-serif] font-normal h-[217px] leading-[46.008px] left-[43px] text-[30.672px] text-[rgba(22,54,18,0.4)] top-[43px] w-[294px]">Try to write down the first thing that comes to mind</p>
    </div>
  );
}

export default function MacBookPro() {
  return (
    <div className="bg-[#fcf8f3] relative size-full" data-name="MacBook Pro - 21">
      <div className="absolute left-[574px] size-[293px] top-[735px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 293 293">
          <circle cx="146.5" cy="146.5" fill="var(--fill-0, #EA6233)" id="Ellipse 3" r="146.5" />
        </svg>
      </div>
      <div className="absolute flex h-[102.836px] items-center justify-center left-[634px] top-[777px] w-[206.987px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[-9.23deg]">
          <p className="font-['Lora:Medium',sans-serif] font-medium leading-[36px] relative text-[#fcf8f3] text-[24px] w-[198px]">Change your perspective</p>
        </div>
      </div>
      <div className="absolute font-['Oatmeal_Pro_TRIAL:Regular',sans-serif] leading-[0] left-[50px] not-italic text-[0px] text-[16px] text-black top-[777px] w-[299px]">
        <p className="leading-[24.5px] mb-0">We were curious about what college students in the US think about failure.</p>
        <p className="[text-decoration-skip-ink:none] decoration-solid leading-[35px] underline">View more responses</p>
      </div>
      <div className="absolute backdrop-blur-[25px] bg-[rgba(252,248,243,0.2)] h-[900px] left-0 top-0 w-[1440px]" />
      <p className="-translate-x-full absolute font-['Oatmeal_Pro_TRIAL:Medium','Noto_Sans:Medium',sans-serif] leading-[36px] left-[1396px] text-[78px] text-[rgba(19,64,37,0.6)] text-right top-[808px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 500" }}>
        →Submit
      </p>
      <p className="absolute font-['Oatmeal_Pro_TRIAL:Regular','Noto_Sans:Regular',sans-serif] leading-[0] left-[507px] text-[#163612] text-[0px] text-[30px] top-[40px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <span className="leading-[normal]">{`What does failure mean to `}</span>
        <span className="font-['Lora:Italic','Noto_Sans:Regular',sans-serif] font-normal italic leading-[normal]">you</span>
        <span className="leading-[normal]">?</span>
      </p>
      <Sticky />
    </div>
  );
}