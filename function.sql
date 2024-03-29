
-- 문자열로부터 자음을 추출하는 함수

CREATE OR REPLACE FUNCTION get_choseong(text)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
    first_char BYTEA;
    unicode_val INTEGER;
    choseong TEXT[] := ARRAY['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
BEGIN
    first_char := SUBSTRING($1, 1, 1)::BYTEA;
    unicode_val := (get_byte(first_char, 0) - 224) * 4096 + (get_byte(first_char, 1) - 128) * 64 + (get_byte(first_char, 2) - 128) - 44032;
    IF unicode_val < 0 OR unicode_val > 11171 THEN
        RETURN '';
    END IF;
    RETURN choseong[(unicode_val / 28 / 21) + 1];
END;
$$;

-- 첫번째 자음의 아스키코드를 추출하는 함수

CREATE OR REPLACE FUNCTION get_first_unicode(text)
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
    first_char BYTEA;
    unicode_val INTEGER;
   	choseong TEXT[] := ARRAY['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
BEGIN
    first_char := SUBSTRING($1, 1, 1)::BYTEA;
    unicode_val := (get_byte(first_char, 0) - 224) * 4096 + (get_byte(first_char, 1) - 128) * 64 + (get_byte(first_char, 2) - 128) - 44032;
    IF unicode_val < 0 OR unicode_val > 11171 THEN
        RETURN 0;
    END IF;
    RETURN ascii(choseong[(unicode_val / 28 / 21) + 1]); 
END;
$$;


CREATE OR REPLACE FUNCTION get_choseong(text)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
    first_char BYTEA;
    unicode_val INTEGER;
    choseong TEXT[] := ARRAY['ㄱ', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅂ', 'ㅅ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    mapping TEXT[] := ARRAY['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    index INTEGER;
BEGIN
    first_char := SUBSTRING($1, 1, 1)::BYTEA;
    unicode_val := (get_byte(first_char, 0) - 224) * 4096 + (get_byte(first_char, 1) - 128) * 64 + (get_byte(first_char, 2) - 128) - 44032;
    IF unicode_val < 0 OR unicode_val > 11171 THEN
        RETURN '';
    END IF;
    index := (unicode_val / 28 / 21) + 1;
    -- 겹자음을 홑자음으로 매핑
    RETURN choseong[index];
END;
$$;