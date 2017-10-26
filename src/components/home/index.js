import { h } from 'preact';
import ContentContainer from '../content-container/index';
import './style.scss';

export default () => {
  return (
    <ContentContainer size="wide" align="center">
      <h1>Hitta skyddsrum</h1>
      <p>Vi hjälper dig att hitta ditt närmaste skyddsrum. Så att du vet vart du ska ta vägen när det verkligen behövs.</p>
      <a class="button" routerLink="/skyddsrum/sok" />
      <div class="fb-like" data-href="http://www.hittaskyddsrum.se" data-layout="button" data-action="like" data-show-faces="true" data-share="false" />
    </ContentContainer>
  );
};
