import React, { useEffect, useState } from 'react';
import { postService } from '../../../../UserFeed/service/post.api-service';
import { StarRate } from '../../../../../components/StarRate/StarRate';
import { tryRequire } from '../../../../../shared/helpers/require';
import { OverlayModal } from '../../../../../components/OverlayModal/OverlayModal';
import { GET_WINE_REVIEWS } from '../../../store/types';
import { Wine, WineQuery, WineTaste } from '../../../models/wine.model';
import { FullPost } from '../../../../UserFeed/models/post.model';
import { BaseRecords } from '../../../../../shared/interfaces/base-records';
import ProcessService from '../../../../../shared/services/process.service';
import StringService from '../../../../../shared/services/string.service';

interface Props {
  wine: Wine;
  query: WineQuery;
  onClose: Function;
}

export function TastePreview(props: Props) {
  const { wine, query } = props;
  const [taste, setTaste] = useState<WineTaste | undefined>();
  const [keyword, setKeyword] = useState<string>('');
  const [reviews, setReviews] = useState<BaseRecords<FullPost>>({} as BaseRecords<FullPost>);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  var moment = require('moment');

  useEffect(() => {
    if (!query || !wine.tastes) {
      setTaste(undefined);
      setReviews({} as BaseRecords<FullPost>);
      return;
    }

    setTaste(wine.tastes.find((taste) => taste.name === query));
  }, [query]);

  useEffect(() => {
    (async () => {
      setSearchQuery(taste ? taste.mentions.map((mention) => mention.keyword).join('|') : undefined);
    })();
  }, [taste]);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    (async () => {
      setReviews(
        await postService[GET_WINE_REVIEWS]({
          filter: { eqWineId: wine._id, inDescription: searchQuery },
        })
      );
    })();
  }, [searchQuery]);

  const url = tryRequire(`imgs/icons/taste/${StringService.toKebabCase(taste?.name, true)}.svg`);

  function display() {
    if (!query || !reviews || !taste) {
      return null;
    }

    if (keyword && !taste.mentions.find((mention) => mention.keyword === keyword)) setKeyword('');
    return reviews.data?.length
      ? reviews.data
          .filter((review) => {
            const re = new RegExp(`\\b(${keyword}|${keyword.replace(' ', '')})\\b`, 'gi');
            return re.exec(review.description);
          })
          .map((review, idx) => {
            const keywords = taste.mentions.map((mention) =>
              mention.keyword !== mention.keyword.replace(' ', '') ? `${mention.keyword}|${mention.keyword.replace(' ', '')}` : mention.keyword
            );
            const re = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
            const match = review.description.match(re) || [];
            review.description = review.description.replaceAll(/<[{1}^>]*>/g, '');
            let desc = review.description;
            match.forEach((keyword) => (desc = desc.replace(keyword, `<span style="color:${taste.color};font-weight:700;">${keyword}</span>`)));
            return (
              <div className="taste-review" key={'REVIEW_' + idx}>
                <div className="content hover-box">
                  <div dangerouslySetInnerHTML={{ __html: desc }}></div>
                </div>
                <div className="summerize">
                  <div className="reviewer">
                    <span className="name">{review.userName} </span>
                    <span className="reviews">({review.ratings} ratings) </span>
                    <span className="time">{moment(review.createdAt).format('ll')}</span>
                  </div>
                  <div className="rating">
                    <StarRate rate={review.rate || 0} />
                  </div>
                </div>
              </div>
            );
          })
      : null;
  }

  const keywords = () =>
    taste?.mentions?.map((mention, idx) => {
      const buttonStyle = () =>
        keyword === mention.keyword
          ? {
              backgroundColor: '#fff',
              color: taste.color,
              borderColor: taste.color,
            }
          : { backgroundColor: taste.color };
      const countStyle = () => {
        return keyword === mention.keyword
          ? { backgroundColor: taste.color, color: '#fff' }
          : {
              backgroundColor: '#fff',
              color: taste.color,
              borderColor: taste.color,
            };
      };
      return (
        <button key={'KEYWORD_' + idx} style={buttonStyle()} onClick={() => setKeyword(keyword === mention.keyword ? '' : mention.keyword)}>
          <div className="count" style={countStyle()}>
            {mention.count}
          </div>
          <div className="title">{mention.keyword}</div>
        </button>
      );
    });

  const scrollDown = async (ev: any) => {
    ProcessService.debounce(
      async () => {
        if (!reviews.page?.index || !reviews.page?.total) {
          return;
        }

        if (reviews.page.index < reviews.page.total - 1) {
          const { scrollTop, scrollHeight, clientHeight } = ev.target;
          if (scrollHeight - clientHeight - scrollTop < clientHeight * 0.1) {
            const res = await postService[GET_WINE_REVIEWS]({
              filter: { eqWineId: wine._id, inDescription: searchQuery },
              page: { index: reviews.page.index + 1 },
            });

            if (res) setReviews({ ...res, data: [...reviews.data, ...res.data] });
          }
        }
      },
      'TASTE-SCROLL',
      1000
    );
  };

  return (
    <OverlayModal if={!!taste} onClose={() => props.onClose()}>
      <section slot="content" className="taste-preview" onClick={() => props.onClose()}>
        <div className="taste-content" onClick={(e) => e.stopPropagation()}>
          <section className="taste-header" style={{ backgroundColor: taste?.color }}>
            <button onClick={() => props.onClose()}>X</button>
            <img src={url} alt={taste?.name} />
            <h2>{taste?.name}</h2>
          </section>
          <section className="taste-keywords">{keywords()}</section>
          <section className="taste-reviews" onScroll={scrollDown}>
            {display()}
          </section>
        </div>
      </section>
    </OverlayModal>
  );
}
