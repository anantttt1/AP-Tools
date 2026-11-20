import { useEffect } from 'react'
import { ArrowUp, ArrowLeft, ShieldCheck, Home, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const sections = [
  ['introduction', 'Introduction'],
  ['no-account-registration', 'No Account Registration'],
  ['information-we-may-collect', 'Information We May Collect'],
  ['file-processing-and-uploaded-files', 'File Processing and Uploaded Files'],
  ['how-we-use-information', 'How We Use Information'],
  ['cookies-and-similar-technologies', 'Cookies and Similar Technologies'],
  ['third-party-services', 'Third-Party Services'],
  ['data-storage-and-security', 'Data Storage and Security'],
  ['data-sharing', 'Data Sharing'],
  ['childrens-privacy', "Children's Privacy"],
  ['external-links', 'External Links'],
  ['your-privacy-rights', 'Your Privacy Rights'],
  ['changes-to-this-privacy-policy', 'Changes to This Privacy Policy'],
  ['contact-information', 'Contact Information'],
] as const

export default function Privacy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return <motion.div className="privacy-page" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
    <div className="privacy-hero">
      <div className="privacy-eyebrow"><ShieldCheck size={15}/> AP CREATIVE TOOLS · TRUST & TRANSPARENCY</div>
      <div className="privacy-hero-row">
        <div>
          <div className="privacy-kicker">YOUR DATA. YOUR CHOICE.</div>
          <h1>Privacy Policy</h1>
          <p>Your privacy matters to us. Learn how AP Creative Tools handles information when you use our services.</p>
          <div className="privacy-updated"><span>Last Updated</span><strong>November 21, 2026</strong></div>
        </div>
        <div className="privacy-hero-icon" aria-hidden="true"><ShieldCheck size={43} strokeWidth={1.35}/></div>
      </div>
    </div>

    <div className="privacy-layout">
      <aside className="privacy-toc">
        <div className="privacy-toc-title"><FileText size={16}/> ON THIS PAGE</div>
        <nav aria-label="Privacy policy sections">
          {sections.map(([id, label], index) => <a href={'#' + id} key={id}><span>{String(index + 1).padStart(2, '0')}</span>{label}</a>)}
        </nav>
        <Link className="privacy-toc-home" to="/"><Home size={15}/> Back to Home</Link>
      </aside>

      <article className="privacy-article">
        <div className="privacy-intro-note"><ShieldCheck size={19}/><p>We aim to explain our practices clearly. This policy describes the information that may be handled through the website, its browser-based tools and the services that support the site.</p></div>

        <section id="introduction" className="privacy-section">
          <span className="privacy-section-number">01</span><h2>Introduction</h2>
          <p>Welcome to AP Creative Tools (“AP Creative Tools”, “we”, “our” or “us”). AP Creative Tools provides online utilities for working with PDFs, images, files, text, developer tasks and other everyday productivity needs.</p>
          <p>This Privacy Policy explains what information may be processed when you visit or use our website, how that information is used, and the choices available to you. It applies to the AP Creative Tools website and the features made available through it.</p>
          <p>Different tools may handle information in different ways. Where a tool processes a selected file directly in your browser, the file is handled by that browser-based operation. We do not describe every tool as local-only unless that is supported by its implementation.</p>
        </section>

        <section id="no-account-registration" className="privacy-section">
          <span className="privacy-section-number">02</span><h2>No Account Registration</h2>
          <p>AP Creative Tools is designed to let visitors use its available tools without creating an account or signing in. The website does not require account registration to access its general tool collection.</p>
          <p>Not requiring an account does not mean that no information can be processed. Technical information may still be handled by the website, your browser, or the infrastructure and third-party services involved in delivering the site.</p>
        </section>

        <section id="information-we-may-collect" className="privacy-section">
          <span className="privacy-section-number">03</span><h2>Information We May Collect</h2>
          <p>The information involved in using the website can depend on the feature you choose and the way your browser and supporting services operate. This may include:</p>
          <ul>
            <li><strong>Technical and usage information:</strong> information associated with a website request, such as IP address, browser type, device or operating-system details, requested page, referring page, and request time, which may be processed by hosting or delivery infrastructure.</li>
            <li><strong>Information you choose to process:</strong> files, text, images or other input that you select or enter into a tool. The nature of this information depends on your use of that tool.</li>
            <li><strong>Browser-stored preferences:</strong> certain features save information such as favorites, recently used tools, sidebar preferences, notes, tasks or saved workflows in your browser's local storage.</li>
            <li><strong>Third-party request information:</strong> when your browser requests a resource from a third-party provider, that provider may receive technical information required to serve the request.</li>
          </ul>
          <p>We do not ask visitors to submit sensitive personal information as a condition of using the general tools. Please avoid entering confidential or sensitive information unless you have considered whether the selected tool is appropriate for it.</p>
        </section>

        <section id="file-processing-and-uploaded-files" className="privacy-section">
          <span className="privacy-section-number">04</span><h2>File Processing and Uploaded Files</h2>
          <p>Some AP Creative Tools features are implemented to process selected files within your browser using browser capabilities and client-side libraries. For those operations, the selected file is read by the page so the requested result can be generated.</p>
          <p>Processing behavior can vary by tool and feature. This policy does not promise that every file or every operation is processed exclusively on your device, nor does it make a blanket claim that files are never transmitted to a server. Review the behavior and instructions shown by the individual tool before selecting a file.</p>
          <p>Generated files may be offered for download or preview in your browser. Temporary browser resources may be used to display or download results. You should close the page when you have finished and manage downloaded copies through your own device.</p>
          <p>We do not make a general promise that uploaded or selected files are automatically deleted after processing. Do not submit information you are not authorized to use or disclose.</p>
        </section>

        <section id="how-we-use-information" className="privacy-section">
          <span className="privacy-section-number">05</span><h2>How We Use Information</h2>
          <p>Information handled through the website may be used, as applicable, to:</p>
          <ul>
            <li>Provide the page, tool or feature that you request.</li>
            <li>Process inputs and generate the output requested by a selected tool.</li>
            <li>Remember selected preferences and locally saved workspace items in your browser.</li>
            <li>Maintain website functionality, reliability and security.</li>
            <li>Identify technical errors, troubleshoot issues and help prevent misuse or abuse.</li>
            <li>Respond to questions or requests that you send through an available contact channel.</li>
          </ul>
          <p>We do not claim to use information for advertising profiling or behavioral advertising through the application based on the code reviewed for this policy.</p>
        </section>

        <section id="cookies-and-similar-technologies" className="privacy-section">
          <span className="privacy-section-number">06</span><h2>Cookies and Similar Technologies</h2>
          <p>The application features reviewed for this policy use browser local storage for certain preferences and workspace data. Local storage is different from a cookie and is generally kept by the browser for the website on that device.</p>
          <p>We have not identified an application-level analytics or advertising-cookie integration in the reviewed source code. However, the hosting environment, browser, or third-party resources may use their own technical mechanisms. Their use is governed by the relevant provider's policies and browser controls.</p>
          <p>You can manage or clear local website data through your browser settings. Clearing it may remove locally saved favorites, recent items, preferences, notes, tasks or workflows.</p>
        </section>

        <section id="third-party-services" className="privacy-section">
          <span className="privacy-section-number">07</span><h2>Third-Party Services</h2>
          <p>AP Creative Tools relies on third-party infrastructure and resources to make the website available. The current implementation includes:</p>
          <ul>
            <li><strong>Vercel:</strong> the website is served from a Vercel deployment. Vercel may process technical request and operational information as part of hosting, delivery, security and reliability.</li>
            <li><strong>Google Fonts:</strong> the website stylesheet requests font files from Google Fonts. When those resources are requested, Google may receive technical connection information such as an IP address and browser request details.</li>
          </ul>
          <p>Tool libraries and browser APIs used by the application may also be involved in performing a selected operation. We do not list unrelated analytics, advertising or payment providers as part of the current implementation reviewed for this policy.</p>
          <p>Third-party providers operate under their own privacy terms and practices. Please review the applicable provider policies for more information about their handling of information.</p>
        </section>

        <section id="data-storage-and-security" className="privacy-section">
          <span className="privacy-section-number">08</span><h2>Data Storage and Security</h2>
          <p>Some workspace information is stored in your browser's local storage on the device you use. This includes items such as favorites, recently used tools, sidebar preference, notes, tasks and saved workflows where those features are used. This information is not automatically synchronized across devices by the local-storage features described here.</p>
          <p>Website requests are handled by the hosting infrastructure, which may retain technical logs under its own operational and retention practices. We do not set out a fixed retention period for provider-managed logs in this policy.</p>
          <p>We use the security measures available through the website platform and its implementation, but no website, browser, network transmission or storage method can be guaranteed to be completely secure. Keep your browser and device protected and avoid entering sensitive information into tools unless appropriate.</p>
        </section>

        <section id="data-sharing" className="privacy-section">
          <span className="privacy-section-number">09</span><h2>Data Sharing</h2>
          <p>We do not sell personal information to third parties. Information may be handled by service providers when this is necessary to host, deliver, secure or operate the website, as described in this policy.</p>
          <p>Information may also be disclosed where required by applicable law, valid legal process or a request from an authorized public authority, or where reasonably necessary to protect the rights, safety and security of the website, its users or others.</p>
          <p>We do not claim that information entered into every tool is never shared or transmitted. The handling of an input depends on the implementation of the selected feature and the services involved.</p>
        </section>

        <section id="childrens-privacy" className="privacy-section">
          <span className="privacy-section-number">10</span><h2>Children's Privacy</h2>
          <p>AP Creative Tools is a general-purpose utility website and is not specifically directed at children under the age required by applicable privacy law. We do not knowingly seek to collect personal information from children in violation of applicable law.</p>
          <p>If you believe a child has provided personal information through the website, please contact us through an available official contact channel so the concern can be reviewed. We will take appropriate steps where required by applicable law.</p>
        </section>

        <section id="external-links" className="privacy-section">
          <span className="privacy-section-number">11</span><h2>External Links</h2>
          <p>The website may contain links to external websites, services or resources. These destinations are operated by third parties and are not controlled by AP Creative Tools.</p>
          <p>We are not responsible for the privacy practices, content or security of external websites. When you follow an external link, review the privacy policy and terms of the destination before providing information.</p>
        </section>

        <section id="your-privacy-rights" className="privacy-section">
          <span className="privacy-section-number">12</span><h2>Your Privacy Rights</h2>
          <p>Depending on your location and applicable law, you may have rights to request access to, correction of, deletion of or information about certain personal data, or to raise an objection or complaint about its handling.</p>
          <p>For information saved by AP Creative Tools features in your browser, you can use your browser's site-data controls to clear local storage. Be aware that this can also remove saved preferences, favorites, recent items, notes, tasks and workflows.</p>
          <p>For information handled by hosting or third-party providers, their own processes and legal obligations may apply. You may also have rights to contact the relevant provider directly. We will consider privacy-related requests sent through an official contact channel made available on the website, subject to applicable law and our ability to identify and locate the information concerned.</p>
        </section>

        <section id="changes-to-this-privacy-policy" className="privacy-section">
          <span className="privacy-section-number">13</span><h2>Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy when the website, its features, service providers or applicable legal requirements change. When we make changes, we will update the “Last Updated” date shown at the top of this page.</p>
          <p>We encourage you to review this page periodically so you remain informed about how information may be handled when using AP Creative Tools.</p>
        </section>

        <section id="contact-information" className="privacy-section">
          <span className="privacy-section-number">14</span><h2>Contact Information</h2>
          <p>If you have a question or concern about this Privacy Policy or privacy practices relating to AP Creative Tools, please use the official contact method made available on the AP Creative Tools website.</p>
          <p>No dedicated privacy email address or postal contact address is specified in this policy. We will not display an invented contact detail.</p>
        </section>

        <div className="privacy-endnote"><ShieldCheck size={18}/><div><strong>Thank you for using AP Creative Tools.</strong><p>We value clear communication and encourage you to review this policy whenever you have questions about privacy.</p></div></div>
        <div className="privacy-bottom-actions"><Link to="/" className="privacy-home-button"><ArrowLeft size={16}/> Back to Home</Link><button type="button" className="privacy-top-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to Top <ArrowUp size={16}/></button></div>
      </article>
    </div>
  </motion.div>
}
