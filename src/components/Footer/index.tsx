import { DefaultFooter } from '@ant-design/pro-layout';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      copyright={`${new Date().getFullYear()}`}
      links={[
        {
          key: 'github',
          title: `https://github.com/aspirantzhang/octopus`,
          href: 'https://github.com/aspirantzhang/octopus',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
