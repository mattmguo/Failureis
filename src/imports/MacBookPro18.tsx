import svgPaths from "./svg-x4qwf3qsga";

function Frame() {
  return (
    <div className="absolute content-stretch flex font-['Oatmeal_Pro_TRIAL:Regular',sans-serif] gap-[27px] items-start leading-[42.5px] left-[1240px] not-italic text-[12px] text-black top-[8px] whitespace-nowrap">
      <p className="relative shrink-0">Book</p>
      <p className="relative shrink-0">Method</p>
      <p className="relative shrink-0">About Us</p>
    </div>
  );
}

function CloseBlack24Dp() {
  return (
    <div className="absolute left-[1276px] size-[96px] top-[51px]" data-name="close_black_24dp 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 96 96">
        <g clipPath="url(#clip0_29_1948)" id="close_black_24dp 1">
          <g id="Vector" />
          <path d={svgPaths.p28da5c00} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_29_1948">
            <rect fill="white" height="96" width="96" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[90px] top-[205px]">
      <div className="font-['Oatmeal_Pro_TRIAL:Regular','Noto_Sans:Regular',sans-serif] leading-[normal] relative shrink-0 text-[24px] text-black w-[599px] whitespace-pre-wrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="mb-0">Failure is… is a collaborative workbook that invites learners to reflect on their relationship with failure. Through a sequence of small activities and prompts, participants explore the stories they tell themselves about success, mistakes, and growth. What begins as individual reflection gradually unfolds into a broader perspective—revealing failure not as an end, but as an essential part of learning and becoming.</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">We loved creating this workbook, and we hope the experience of moving through it is just as meaningful for you as it was for us while making it.</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">{`Love, `}</p>
        <p>Andrea, Sophia, Matthew</p>
      </div>
    </div>
  );
}

export default function MacBookPro() {
  return (
    <div className="bg-[#fcf8f3] relative size-full" data-name="MacBook Pro - 18">
      <p className="absolute font-['Oatmeal_Pro_TRIAL:Regular','Noto_Sans:Regular',sans-serif] leading-[42.5px] left-[27px] text-[12px] text-black top-[8px] w-[174px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        What does failure mean to you?
      </p>
      <Frame />
      <p className="absolute font-['Oatmeal_Pro_TRIAL:Medium',sans-serif] leading-[normal] left-[559px] not-italic text-[#163612] text-[12px] top-[228px] whitespace-nowrap">20</p>
      <div className="absolute bg-[#c5dded] h-[900px] left-0 top-0 w-[1440px]" />
      <p className="absolute font-['Lora:Medium_Italic',sans-serif] font-medium italic leading-[normal] left-[90px] text-[40px] text-black top-[73px] whitespace-nowrap">About</p>
      <CloseBlack24Dp />
      <Frame1 />
      <div className="absolute font-['Oatmeal_Pro_TRIAL:Regular',sans-serif] leading-[0] left-[860px] not-italic text-[#163612] text-[24px] top-[205px] w-[490px] whitespace-pre-wrap">
        <p className="mb-0">
          <span className="font-['Oatmeal_Pro_TRIAL:Medium',sans-serif] leading-[normal] not-italic text-[#100]">Andrea</span>
          <span className="font-['Oatmeal_Pro_TRIAL:Medium',sans-serif] leading-[normal] not-italic text-[rgba(17,0,0,0.4)]">{` `}</span>
          <span className="font-['Oatmeal_Pro_TRIAL:Medium',sans-serif] leading-[normal] not-italic text-[#100]">Benatar</span>
          <span className="font-['Oatmeal_Pro_TRIAL:Medium',sans-serif] leading-[normal] not-italic text-[#163612]">{` `}</span>
          <span className="leading-[normal]">is a senior studying Product Design at Carnegie Mellon University.</span>
          <span className="font-['Oatmeal_Pro_TRIAL:Medium',sans-serif] leading-[normal] not-italic text-[#163612]">{` `}</span>
        </p>
        <p className="leading-[normal] mb-0">&nbsp;</p>
        <p className="mb-0">
          <span className="font-['Oatmeal_Pro_TRIAL:Medium',sans-serif] leading-[normal] not-italic text-[#163612]">Sophia Fan</span>
          <span className="leading-[normal]">{` recently graduated with a degree in Communication Design from Carnegie Mellon University. `}</span>
        </p>
        <p className="leading-[normal] mb-0">&nbsp;</p>
        <p>
          <span className="font-['Oatmeal_Pro_TRIAL:Medium',sans-serif] leading-[normal] not-italic text-[#163612]">Matthew Guo</span>
          <span className="leading-[normal]">{` is a senior studying Information Systems and Human Computer Interaction at Canegie Mellon University. `}</span>
        </p>
      </div>
    </div>
  );
}