export type InfoLang = 'zh' | 'en';

export interface InfoSection {
  id: string;
  title: string;
  html: string;
}

export interface InfoContent {
  kicker: string;
  title: string;
  description: string;
  intro: string;
  updated: string;
  tocTitle: string;
  sections: InfoSection[];
}

const repoUrl = 'https://github.com/xiqiqiqi/oddities-and-mysteries';
const issuesUrl = `${repoUrl}/issues`;
const licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/';
const mitUrl = 'https://github.com/xiqiqiqi/oddities-core/blob/main/LICENSE';
const githubPrivacyUrl = 'https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement';
const netcnUrl = 'https://netcn.org/';

function ext(url: string, label: string): string {
  return `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
}

export function aboutContent(lang: InfoLang): InfoContent {
  if (lang === 'en') {
    return {
      kicker: 'ABOUT / THE ARCHIVE',
      title: 'About XIQIQI',
      description: 'XIQIQI is a bilingual, open archive of strange events, stories, objects, places, and creatures.',
      intro: 'We are less interested in “strangeness” as a spectacle than in the people, evidence, and storytelling behind it.',
      updated: 'Last updated: 17 November 2026',
      tocTitle: 'On this page',
      sections: [
        {
          id: 'mission',
          title: 'What we do',
          html: `
            <p>XIQIQI is an independent, non-commercial archive. It collects subjects that are hard to classify: unexplained events, strange tales, unusual objects, uncanny places, and creatures at the edge of the record.</p>
            <p>The archive is published in Chinese and English and organised into five channels: Mysteries, Strange Tales, Objects, Places, and Creatures. Portal pages link to the channel sites that hold the full entries, so the same story is not duplicated across the network.</p>
            <p>We do not aim for shock headlines. The aim is to make each entry readable, traceable, and honest about what is known, what is disputed, and what remains folklore.</p>
          `,
        },
        {
          id: 'method',
          title: 'How the entries are made',
          html: `
            <p>Each entry is built around a fact ledger and a source ledger. Sources are listed with publisher, year and licence; where an English use note is available, it is also shown, so a reader can follow the trail rather than take our word for it.</p>
            <ul>
              <li><strong>Credibility labels:</strong> Verified, Disputed, Folklore, and Hoax describe the present state of the evidence, not a final verdict on the subject.</li>
              <li><strong>Reconstruction images:</strong> covers and diagrams may be AI-assisted reconstructions. They are illustrations, not historical photographs.</li>
              <li><strong>Third-party images:</strong> used under the licence recorded in the source ledger. Rights remain with their original owners.</li>
              <li><strong>Corrections:</strong> handled publicly through the content repository, with the issue tracker as the single entry point.</li>
            </ul>
          `,
        },
        {
          id: 'ai',
          title: 'AI and the editorial process',
          html: `
            <p>XIQIQI currently has no human final-review step. Entries are drafted, translated, checked, and given a final editorial pass by an AI editorial workflow. We disclose that plainly and do not present the archive as human-reviewed.</p>
            <p>AI can make mistakes: a date can be wrong, a source can be misread, a translation can flatten a nuance, and an image can imply more certainty than the record supports. That is exactly why the source ledger and the correction route are part of the product, not an appendix.</p>
            <p>If an entry matters to a decision, check the primary sources yourself. If something is wrong, report it in the public issue tracker so the correction is visible to everyone.</p>
          `,
        },
        {
          id: 'standards',
          title: 'Editorial and image standards',
          html: `
            <p>Entries aim for complete narrative prose rather than listicles. We avoid “shocking”, “bizarre beyond belief”, and similar clickbait; the subject should carry the interest on its own.</p>
            <p>Where a reconstruction is shown, the caption or licence note should make clear that it is a scene reconstruction, not a historical photograph. Where a historical image is shown, its source and licence belong in the ledger.</p>
            <p>Real people, institutions, communities, and events are discussed from public sources. An entry is not an accusation, a diagnosis, or a definitive finding about any person or group.</p>
          `,
        },
        {
          id: 'corrections',
          title: 'Corrections',
          html: `
            <p>All corrections go through the <a href="${issuesUrl}" target="_blank" rel="noopener">public issue tracker</a>. Please include the page URL, the passage that is wrong, and a source that supports the correction. Public issues keep the reasoning visible and let other readers follow up.</p>
            <p>There is no fixed waiting period before a correction is considered. We review reports as soon as they can be verified and update the entry, the ledger, or both. If a report cannot be verified, the entry stays as it is until better material appears.</p>
          `,
        },
        {
          id: 'open',
          title: 'Open source and reuse',
          html: `
            <p>The content repository is public at ${ext(repoUrl, 'xiqiqiqi/oddities-and-mysteries')}. Text and original illustrations are released under ${ext(licenseUrl, 'CC BY-SA 4.0')}; the site engine is released under the ${ext(mitUrl, 'MIT licence')}.</p>
            <p>Attribution should name “稀奇奇 / XIQIQI”, link to ${ext('https://xiqiqi.com', 'xiqiqi.com')}, link to the licence, and indicate whether changes were made. If you remix or build on the material, your contribution must use the same licence.</p>
            <p>Third-party images and quoted material keep their own terms. Check the source ledger before reusing an image.</p>
          `,
        },
        {
          id: 'contact',
          title: 'Contact',
          html: `
            <p>The archive has no support inbox or phone line. The public issue tracker is the contact route for corrections, rights requests, and editorial questions: ${ext(issuesUrl, 'browse the issue tracker')}.</p>
            <p>For privacy, licensing, and liability details, see the <a href="/en/legal/">legal and privacy page</a>.</p>
          `,
        },
      ],
    };
  }

  return {
    kicker: 'ABOUT / 关于',
    title: '关于稀奇奇',
    description: '稀奇奇是一个中英双语的开放档案，收集世界各地难以归类的故事、物件、地点与生物。',
    intro: '我们关心的不只是“奇”本身，而是奇闻背后的人、证据与叙述方式。',
    updated: '最后更新：2026年11月17日',
    tocTitle: '本页内容',
    sections: [
      {
        id: 'mission',
        title: '我们做什么',
        html: `
          <p>稀奇奇（XIQIQI）是一个独立、非商业的开放档案，收集那些不容易归类的题材：未解事件、离奇故事、奇异物件、隐秘地点，以及处在记录边缘的生物。</p>
          <p>全站以中文和英文发布，分为五个频道：未解之谜、离奇故事、奇物、奇境、奇兽。门户页只做索引，完整条目放在各自的频道站，同一篇故事不会在网络里复制多份。</p>
          <p>我们不追求“震惊”“揭秘”式的标题。目标是让每一条档案可读、可追溯，并且诚实说明哪些已经核实、哪些仍有争议、哪些只是传说。</p>
        `,
      },
      {
        id: 'method',
        title: '内容是怎么做出来的',
        html: `
          <p>每条档案都围绕一份事实台账和一份来源台账展开。来源会列出作者或机构、年份与许可；用途说明按语言显示，读者可以顺着线索自己核对，而不是只相信我们的结论。</p>
          <ul>
            <li><strong>可信度分级：</strong>已核实、争议、传说、骗局描述的是当前证据状态，不是对题材的最终判决。</li>
            <li><strong>场景复原图：</strong>封面与示意图可能是 AI 辅助复原，是插图，不是历史照片。</li>
            <li><strong>第三方图片：</strong>按来源台账记录的许可使用，权利仍归原权利人。</li>
            <li><strong>更正：</strong>统一通过内容仓的公开 Issue 处理，入口只有一个。</li>
          </ul>
        `,
      },
      {
        id: 'ai',
        title: 'AI 与编辑流程',
        html: `
          <p>稀奇奇目前不设人工终审环节，条目由 AI 编辑流程完成撰写、翻译、核查与最终编辑。我们明确披露这一点，不把内容包装成人工审核的成果。</p>
          <p>AI 会出错：年代可能写错，来源可能读偏，翻译可能磨平语气，图像可能暗示出比史料更强的确定性。这正是来源台账和更正入口必须成为产品一部分，而不是附录的原因。</p>
          <p>如果一条档案会影响你的实际判断，请自己核对一次原始来源。如果发现错误，请通过公开 Issue 报告，让更正过程公开可见。</p>
        `,
      },
      {
        id: 'standards',
        title: '编辑与图像标准',
        html: `
          <p>条目以完整的叙事为目标，不写成清单式猎奇。我们避开“震惊”“不可思议到极点”一类点击诱饵，让题材本身承担吸引力。</p>
          <p>使用场景复原图时，图注或许可说明必须让读者看出它是场景复原，不是历史照片。使用历史图片时，来源与许可必须进入来源台账。</p>
          <p>涉及真实人物、机构、社群与事件的内容，均基于公开资料叙述。条目不是对任何个人或群体的指控、诊断或定性。</p>
        `,
      },
      {
        id: 'corrections',
        title: '更正机制',
        html: `
          <p>所有更正统一走 <a href="${issuesUrl}" target="_blank" rel="noopener">内容仓的公开 Issue</a>。请附上页面地址、错误段落，以及支持更正的来源。公开 Issue 能让推理过程可见，也方便其他读者跟进。</p>
          <p>我们不为更正设置固定等待期。收到可以核验的报告后，会尽快复核并更新条目或台账；如果报告无法核验，条目会保持原样，直到出现更好的材料。</p>
        `,
      },
      {
        id: 'open',
        title: '开源与再利用',
        html: `
          <p>内容仓公开在 ${ext(repoUrl, 'xiqiqiqi/oddities-and-mysteries')}。文字与原创插图采用 ${ext(licenseUrl, 'CC BY-SA 4.0')} 许可，站点引擎采用 ${ext(mitUrl, 'MIT 许可')}。</p>
          <p>转载时请署名“稀奇奇 / XIQIQI”，链接到 ${ext('https://xiqiqi.com', 'xiqiqi.com')} 和许可协议，并注明是否做过修改。若你改编或基于这些材料创作，你的贡献也必须采用相同许可。</p>
          <p>第三方图片与引用材料遵循各自条款。再次使用图片前，请先查看条目底部的来源台账。</p>
        `,
      },
      {
        id: 'contact',
        title: '联系',
        html: `
          <p>本站没有客服邮箱或电话。公开 Issue 是更正、权利请求与编辑问题的统一联系入口：${ext(issuesUrl, '查看公开 Issue')}。</p>
          <p>隐私、许可与责任条款见 <a href="/legal/">法律与隐私页面</a>。</p>
        `,
      },
    ],
  };
}

export function legalContent(lang: InfoLang): InfoContent {
  if (lang === 'en') {
    return {
      kicker: 'LEGAL / PRIVACY / LICENCE',
      title: 'Legal, privacy and licensing',
      description: 'Disclaimer, terms of use, privacy policy, copyright licence, and correction policy for XIQIQI.',
      intro: 'This page applies to xiqiqi.com and the five channel sites. It is written to be readable, not to mimic a court filing.',
      updated: 'Last updated: 17 November 2026',
      tocTitle: 'On this page',
      sections: [
        {
          id: 'acceptance',
          title: 'Acceptance and scope',
          html: `
            <p>By accessing or using this site, you agree to this page. If you do not agree, please stop using the site. This page applies to the portal at xiqiqi.com and the channel sites at places.xiqiqi.com, creatures.xiqiqi.com, mysteries.xiqiqi.com, objects.xiqiqi.com, and tales.xiqiqi.com.</p>
            <p>The Chinese version is the authoritative version. The English text is a translation provided for convenience; if the two differ, the Chinese version controls.</p>
          `,
        },
        {
          id: 'disclaimer',
          title: 'Disclaimer',
          html: `
            <p>The archive is published for information, education, and entertainment. It is not professional advice — medical, legal, financial, historical, archaeological, or otherwise — and must not be used as a substitute for a qualified professional or a primary source.</p>
            <p>We do not warrant that any entry is accurate, complete, current, or free from error. Sources can be wrong, incomplete, or superseded. Credibility labels are editorial notes about the state of the evidence, not guarantees.</p>
            <p>Entries about real people, institutions, communities, and events are based on public material. They are not accusations, diagnoses, or definitive findings, and mention of a person or organisation is not an endorsement of any claim about them.</p>
            <p>AI-assisted reconstruction images are illustrations. They are not historical photographs and must not be treated as documentary evidence, identification, or forensic material.</p>
            <p>External links are provided for reference. We do not control third-party sites and do not endorse their content, products, or privacy practices.</p>
            <p>To the fullest extent permitted by applicable law, XIQIQI accepts no liability for loss or damage arising from reliance on the site. Mandatory rights that cannot be excluded by law remain unaffected.</p>
          `,
        },
        {
          id: 'accuracy',
          title: 'Accuracy and the credibility labels',
          html: `
            <p>“Verified” means that reliable sources or multiple independent accounts support the core facts, as far as the editorial process can establish. It does not mean that every detail is correct.</p>
            <p>“Disputed” means the core facts are broadly supported but an interpretation, cause, or detail is contested. “Folklore” means the material comes from legend, oral tradition, or urban legend. “Hoax” means the subject is a known or strongly evidenced fabrication. These labels are not verdicts about the people who tell the story.</p>
            <p>If you believe a label is wrong, report it with sources in the public issue tracker. The label should change when the evidence changes.</p>
          `,
        },
        {
          id: 'privacy',
          title: 'Privacy policy',
          html: `
            <p>This is a static, public website. It has no user accounts, comments, newsletter, payment flow, advertising, or analytics/tracking script. It does not set cookies.</p>
            <p><strong>Browser storage.</strong> The site stores one preference in your browser's local storage: <code>xiqiqi-theme</code> (light or dark). It stays on your device, is not sent to us, and can be removed by clearing site data in your browser.</p>
            <p><strong>Offline cache.</strong> A service worker may cache pages and images in your browser so the site can load with a weak connection. The cache is local and can be cleared through your browser settings.</p>
            <p><strong>Hosting.</strong> The site is served by GitHub Pages. GitHub may process technical data such as IP address, request time, user agent, and referring page for security, delivery, and operational purposes under the ${ext(githubPrivacyUrl, 'GitHub Privacy Statement')}. XIQIQI does not build visitor profiles from that data.</p>
            <p><strong>Issues and voluntary contact.</strong> Browsing the public issue tracker does not require a GitHub account. If you open or reply to an issue, GitHub will process your account and issue data, and the issue is public. Please do not include sensitive personal information. We use the issue only to review and respond to the report.</p>
            <p><strong>External links.</strong> Links to sources, ${ext(netcnUrl, 'netcn.org')}, and GitHub take you to services with their own privacy policies. Their practices are not covered by this page.</p>
            <p><strong>Children.</strong> The site is not directed to children and does not knowingly collect children's personal information. If you believe a child's information has been posted in an issue, report it so it can be removed.</p>
            <p><strong>International processing.</strong> GitHub may process data in countries other than yours. If you do not want that, please do not submit an issue.</p>
            <p><strong>Changes.</strong> If the data practices change, this page will be updated and the date at the top revised.</p>
          `,
        },
        {
          id: 'license',
          title: 'Copyright and licensing',
          html: `
            <p>Unless otherwise noted, text, original maps, charts, and original illustrations are licensed under ${ext(licenseUrl, 'Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)')}. You may share and adapt the material, including commercially, if you give appropriate credit, link to the licence, indicate changes, and release adaptations under the same licence.</p>
            <p>Suggested attribution: “稀奇奇 / XIQIQI — https://xiqiqi.com”, with a link to the licence and a note of any changes.</p>
            <p>The site engine in oddities-core is licensed under the ${ext(mitUrl, 'MIT licence')}. That licence covers code, not editorial content.</p>
            <p>Third-party images, quotations, trademarks, and other material remain the property of their owners and are used under the licence or exception recorded in the source ledger. A CC licence on the site does not relicense third-party material.</p>
            <p>Some covers and diagrams are AI-assisted. They are released under CC BY-SA 4.0 to the extent XIQIQI can license them, but XIQIQI cannot warrant that no third-party rights attach to a generated image. Rights holders can use the correction route below.</p>
            <p>Short quotations are used for identification, criticism, and commentary. All rights in quoted material remain with the original rights holders.</p>
          `,
        },
        {
          id: 'terms',
          title: 'Terms of use',
          html: `
            <p><strong>Permitted use.</strong> You may read, link to, and share the site. You may reuse content under the licences above. You may not remove attribution, licence notices, or proprietary notices from a copy.</p>
            <p><strong>Prohibited use.</strong> You must not use the site unlawfully; attempt to gain unauthorised access; introduce malware; interfere with the site's availability; scrape at a volume that degrades service; impersonate XIQIQI or its editors; or infringe the rights of others.</p>
            <p><strong>Submissions.</strong> If you submit a correction, source, image, or other material through the issue tracker, you confirm that you have the right to share it and grant XIQIQI a non-exclusive, royalty-free, worldwide licence to use, edit, publish, and archive it for editorial purposes. Public issues are public; do not submit confidential material.</p>
            <p><strong>Third-party material.</strong> We do not warrant that every third-party item is free of claims in every jurisdiction. If you are a rights holder, use the correction route and identify the work and the basis of your request.</p>
            <p><strong>Availability.</strong> The site is provided on an “as is” and “as available” basis. We may change, suspend, or remove pages without notice and do not promise permanent availability or archiving.</p>
            <p><strong>Liability.</strong> To the extent permitted by law, XIQIQI is not liable for indirect, incidental, special, consequential, or punitive loss arising from use of the site. Nothing here excludes liability that cannot lawfully be excluded.</p>
            <p><strong>Severability and changes.</strong> If a provision is held invalid, the remaining provisions continue. We may update these terms; continued use after an update means acceptance of the revised version.</p>
          `,
        },
        {
          id: 'corrections',
          title: 'Corrections, removal and complaints',
          html: `
            <p>Corrections and rights complaints go through the <a href="${issuesUrl}" target="_blank" rel="noopener">public issue tracker</a>. Please include the URL, the exact passage or image, the problem, and supporting sources or rights information.</p>
            <p>There is no fixed two-week window and no promise of a particular response time. Reports are reviewed as soon as they can be verified. Where a rights claim is credible, the material may be removed while the claim is checked; where a factual correction is verified, the entry and ledger are updated.</p>
            <p>Abusive, vexatious, or doxxing reports may be closed without action. Public issues should not contain private personal data.</p>
          `,
        },
        {
          id: 'law',
          title: 'Law and interpretation',
          html: `
            <p>This page is not legal advice. If a dispute requires legal advice, consult a qualified lawyer in the relevant jurisdiction.</p>
            <p>The Chinese version is authoritative. The English version is a convenience translation. If they conflict, the Chinese version prevails. Mandatory consumer and other rights that cannot be waived by contract are not affected by this page.</p>
          `,
        },
        {
          id: 'contact',
          title: 'Contact',
          html: `
            <p>The public issue tracker is the contact route for corrections, privacy questions, and rights requests: ${ext(issuesUrl, 'browse the issue tracker')}.</p>
            <p>For the archive's editorial approach, see the <a href="/en/about/">about page</a>.</p>
          `,
        },
      ],
    };
  }

  return {
    kicker: 'LEGAL / 法律与隐私',
    title: '法律、隐私与许可',
    description: '稀奇奇的免责声明、使用条款、隐私政策、版权许可与更正删除政策。',
    intro: '本页适用于 xiqiqi.com 及五个频道站。写法尽量清楚，不模仿法律文书。',
    updated: '最后更新：2026年11月17日',
    tocTitle: '本页内容',
    sections: [
      {
        id: 'acceptance',
        title: '接受与适用范围',
        html: `
          <p>访问或使用本站，即表示你同意本页内容。如果你不同意，请停止使用。本页适用于门户站 xiqiqi.com，以及 places.xiqiqi.com、creatures.xiqiqi.com、mysteries.xiqiqi.com、objects.xiqiqi.com、tales.xiqiqi.com 五个频道站。</p>
          <p>本页以中文版本为准。英文版本只是便于阅读的翻译；如果两者不一致，以中文版本为准。</p>
        `,
      },
      {
        id: 'disclaimer',
        title: '免责声明',
        html: `
          <p>本站内容用于信息、教育与娱乐目的，不构成任何专业建议——包括但不限于医疗、法律、金融、历史、考古建议——也不能替代合格专业人士或原始史料。</p>
          <p>我们不保证任何条目准确、完整、及时或没有错误。来源可能出错、残缺或被后来研究推翻。可信度标签只是编辑对当前证据状态的标注，不是保证。</p>
          <p>涉及真实人物、机构、社群与事件的条目均基于公开资料。它们不是指控、诊断或最终定性；提到某个人或机构，也不代表对其相关说法的背书。</p>
          <p>AI 辅助生成的场景复原图是插图，不是历史照片，不得当作文献证据、身份识别材料或鉴定材料使用。</p>
          <p>外部链接仅为查阅方便提供。我们无法控制第三方网站，也不为其内容、产品或隐私做法背书。</p>
          <p>在适用法律允许的最大范围内，稀奇奇不对因依赖本站内容而产生的损失或损害承担责任。法律强制规定、不能被排除的权利不受影响。</p>
        `,
      },
      {
        id: 'accuracy',
        title: '准确性与可信度分级',
        html: `
          <p>“已核实”表示按照编辑流程能够确认，核心事实有可靠来源或多方独立记载支持；不代表每个细节都正确。</p>
          <p>“争议”表示核心事实大体成立，但某种解释、成因或细节仍有争论。“传说”表示材料来自传说、口述传统或都市传说。“骗局”表示该题材是已知或证据较强的伪造。标签不是对讲述者的判决。</p>
          <p>如果你认为标签不准确，请附来源通过公开 Issue 报告。证据变化时，标签应当随之改变。</p>
        `,
      },
      {
        id: 'privacy',
        title: '隐私政策',
        html: `
          <p>本站是静态公开网站，不设账号、评论、邮件订阅、支付流程、广告或统计分析脚本，也不设置 Cookie。</p>
          <p><strong>浏览器本地存储。</strong>本站只在浏览器 local storage 中保存一项偏好：<code>xiqiqi-theme</code>（明暗主题）。它留在你的设备上，不会传给我们；清除浏览器站点数据即可删除。</p>
          <p><strong>离线缓存。</strong>Service Worker 可能把页面与图片缓存到你的浏览器，以便弱网时打开。缓存只存在本地，可通过浏览器设置清除。</p>
          <p><strong>托管服务。</strong>本站由 GitHub Pages 托管。GitHub 可能出于安全、分发与运维目的，按 ${ext(githubPrivacyUrl, 'GitHub 隐私声明')} 处理 IP 地址、请求时间、User-Agent、来源页面等技术数据。稀奇奇不据此建立访问者画像。</p>
          <p><strong>Issue 与主动联系。</strong>浏览公开 Issue 列表不需要 GitHub 账号；如果你新建或回复 Issue，GitHub 会处理你的账号与 Issue 数据，且 Issue 是公开的。请勿提交敏感个人信息。我们只把它用于复核与回应报告。</p>
          <p><strong>外部链接。</strong>来源、${ext(netcnUrl, 'netcn.org')} 与 GitHub 等链接会把你带到第三方服务，它们有自己的隐私政策，不在本页覆盖范围内。</p>
          <p><strong>儿童。</strong>本站不面向儿童，也不主动收集儿童个人信息。若你认为 Issue 中出现了儿童信息，请报告，我们会尽快删除。</p>
          <p><strong>跨境处理。</strong>GitHub 可能在你所在国家或地区以外处理数据。如果不希望这样，请不要提交 Issue。</p>
          <p><strong>变更。</strong>如果数据处理方式变化，本页会更新，并同步修改顶部的更新日期。</p>
        `,
      },
      {
        id: 'license',
        title: '版权与许可',
        html: `
          <p>除非另有说明，本站文字、原创地图、图表与原创插图采用 ${ext(licenseUrl, '知识共享 署名—相同方式共享 4.0 国际许可协议（CC BY-SA 4.0）')}。你可以复制、改编和再发布，包括商业用途，但必须适当署名、链接许可协议、注明是否修改，并以相同许可发布改编作品。</p>
          <p>建议署名：“稀奇奇 / XIQIQI — https://xiqiqi.com”，并附许可链接与修改说明。</p>
          <p>oddities-core 站点引擎代码采用 ${ext(mitUrl, 'MIT 许可')}。该许可覆盖代码，不覆盖编辑内容。</p>
          <p>第三方图片、引用文字、商标及其他材料仍归原权利人所有，按来源台账记录的许可或例外使用。本站的 CC 许可不会把第三方材料重新授权。</p>
          <p>部分封面与示意图由 AI 辅助生成。稀奇奇在自身可授权的范围内按 CC BY-SA 4.0 发布，但无法保证生成图像不涉及第三方权利。权利人可通过下方更正入口联系。</p>
          <p>短引用用于识别、评论与说明，引用材料的一切权利仍归原权利人。</p>
        `,
      },
      {
        id: 'terms',
        title: '使用条款',
        html: `
          <p><strong>允许的使用。</strong>你可以阅读、链接和分享本站，也可以按上述许可再利用内容；不得删除副本中的署名、许可声明或权利声明。</p>
          <p><strong>禁止的使用。</strong>不得以违法方式使用本站；不得试图未经授权访问系统；不得植入恶意代码；不得干扰网站可用性；不得以影响服务稳定性的规模抓取；不得冒充稀奇奇或其编辑；不得侵犯他人权利。</p>
          <p><strong>用户提交。</strong>如果你通过 Issue 提交更正、来源、图片或其他材料，即确认你有权分享，并授予稀奇奇非独占、免费、全球范围的使用、编辑、发布与存档许可，用于编辑目的。公开 Issue 就是公开的，请勿提交机密材料。</p>
          <p><strong>第三方材料。</strong>我们不保证每一项第三方材料在任何司法辖区都不存在权利主张。如果你是权利人，请通过更正入口提交作品信息与权利依据。</p>
          <p><strong>可用性。</strong>本站按“现状”与“现有可用”提供。我们可能变更、暂停或移除页面，不承诺永久可用或永久存档。</p>
          <p><strong>责任限制。</strong>在适用法律允许的范围内，稀奇奇不对因使用本站而产生的间接、附带、特殊、后果性或惩罚性损失承担责任。本页不排除依法不能排除的责任。</p>
          <p><strong>条款可分性与变更。</strong>如果某一条款被认定无效，其余条款继续有效。我们可能更新本条款；更新后继续使用即视为接受修订版本。</p>
        `,
      },
      {
        id: 'corrections',
        title: '更正、删除与投诉',
        html: `
          <p>更正与权利投诉统一走 <a href="${issuesUrl}" target="_blank" rel="noopener">内容仓的公开 Issue</a>。请附页面地址、具体段落或图片、问题说明，以及支持更正的来源或权利信息。</p>
          <p>我们不设固定两周等待期，也不承诺特定响应时限。收到报告后会尽快复核；权利主张可信时，可能先移除材料再核查；事实更正核实后，会更新条目与来源台账。</p>
          <p>辱骂、骚扰、恶意重复或包含人肉信息的报告可能直接关闭。公开 Issue 中请勿包含私人个人数据。</p>
        `,
      },
      {
        id: 'law',
        title: '法律适用与解释',
        html: `
          <p>本页不构成法律意见。如果争议需要法律意见，请咨询相关司法辖区的合格律师。</p>
          <p>本页以中文版本为准，英文版本只是便利翻译；如有冲突，以中文版本为准。依法不能通过合同放弃的消费者权利及其他强制权利，不受本页影响。</p>
        `,
      },
      {
        id: 'contact',
        title: '联系',
        html: `
          <p>更正、隐私问题与权利请求的公开联系入口：${ext(issuesUrl, '查看公开 Issue')}。</p>
          <p>关于本站的编辑方法，见 <a href="/about/">关于页面</a>。</p>
        `,
      },
    ],
  };
}
